package com.bbangbuddy.global.util;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @PackageName : com.bbangbuddy.global.util
 * @FileName : ConditionFactory
 * @Author : hjsim
 * @Date : 2025-06-10
 * @Description : dto를 이용해 predicate를 만들고 여러 조건들을 한번에 생성하는 팩토리 클래스
 */
@Slf4j
@Getter
@ToString
@EqualsAndHashCode
public class ConditionFactory {

    private final List<Predicate> predicates;

    private ConditionFactory(List<Predicate> predicates) {
        this.predicates = predicates;
    }

    public static ConditionFactory of(Path<?> entityPath, Object dto) {
        return new ConditionFactory(createPredicateList(entityPath, dto));
    }

    // dto의 필드와 값을 이용하여 Predicate 리스트를 생성
    private static List<Predicate> createPredicateList(Path<?> entityPath, Object dto) {
        Field [] fields = dto.getClass().getDeclaredFields();
        Map<String, Object> dtoMap = convertUsingReflection(dto, fields);
        return Arrays.stream(fields)
            .map((field) -> field.isAnnotationPresent(QFileVariable.class)
                ? makeFileVariableQueryExpression(entityPath, field, dtoMap.get(field.getName()))
                : getQueryExpression(entityPath, field.getName(), dtoMap.get(field.getName())))
            .collect(Collectors.toList());
    }

    // QFileVariable 어노테이션이 붙은 필드에 대한 동적 쿼리 조건 생성
    private static Predicate makeFileVariableQueryExpression(Path<?> entityPath, Field field, Object value) {
        QFileVariable qFileVariable = (QFileVariable)field.getAnnotation(QFileVariable.class);
        String fieldName = StringUtils.isBlank(qFileVariable.field()) ? field.getName() : qFileVariable.field();
        if (!qFileVariable.qClassName().equalsIgnoreCase(entityPath.getMetadata().getName())) {
            log.debug("QFileVariable variable name '{}' does not match the entityPath metadata name '{}'.", qFileVariable.qClassName(), entityPath.getMetadata().getName());
            return null;
        } else {
            return qFileVariable.exclusion() ? null : getQueryExpression(entityPath, fieldName, value);
        }
    }

    // 필드 이름과 값에 따라 쿼리 표현식을 생성 pot, title(, description, address), "신전떡볶이"
    private static Predicate getQueryExpression(Path<?> entityPath, String field, Object value) {
        if (value instanceof List && !((List)value).isEmpty()) {
            List<?> listValue = (List)value;
            String joinParam = (String)listValue.stream().map(Object::toString).collect(Collectors.joining(","));
            return QueryUtils.getQueryExpression(entityPath, field, joinParam);
        } else {
            return QueryUtils.getQueryExpression(entityPath, field, String.valueOf(value));
        }
    }

    // 리플렉션을 이용해서 객체의 필드와 값을 Map으로 변환
    private static Map<String, Object> convertUsingReflection(Object object, Field[] fields) {
        Map<String, Object> map = new HashMap();

        try {
            for(Field field : fields) {
                field.setAccessible(true);
                map.put(field.getName(), field.get(object));
            }
        } catch (IllegalAccessException e) {
            log.error("{}", e.getMessage(), e);
        }

        return map;
    }

    // Predicate 타입을 지정하고 List를 배열로 변환후 반환
    public Predicate[] getPredicateArray() {
        BooleanBuilder builder = new BooleanBuilder();
        for (Predicate predicate : predicates) {
            builder.or(predicate);
        }
        return builder.getValue() != null ? new Predicate[]{builder.getValue()} : new Predicate[0];
    }

}
