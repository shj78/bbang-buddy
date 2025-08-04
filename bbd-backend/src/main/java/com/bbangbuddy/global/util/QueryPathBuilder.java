package com.bbangbuddy.global.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.PathBuilder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

/**
 * @PackageName : com.bbangbuddy.global.util
 * @FileName : QueryPathBuilder
 * @Author : hjsim
 * @Date : 2025-06-10
 * @Description :  Querydsl PathBuilder를 사용하여 동적 쿼리 조건을 생성하는 빌더 클래스
 */
@Slf4j
@Getter
public class QueryPathBuilder {

    private final PathBuilder<?> builder;
    private final QueryPath queryPath;

    private QueryPathBuilder(PathBuilder<?> builder, QueryPath queryPath) {
        this.builder = builder;
        this.queryPath = queryPath;
    }

    // QueryPathBuilder 객체 생성 및 필드 정보 초기화
    public static QueryPathBuilder of(Path<?> entityPath, final String fieldName) {
        try {
            //필드 타입 정보 조회
            QueryPath queryPath = getEntityFieldType(entityPath, fieldName);

            // {type: Pot.class, metadata: Metadata{title='pot'...}}
            PathBuilder<?> pathBuilder = new PathBuilder(entityPath.getClass(), entityPath.getMetadata().getName());
            return new QueryPathBuilder(pathBuilder, queryPath);
        } catch (NoSuchFieldException var4) {
            log.debug("NoSuchFieldException :: { entityPath : {}, fieldName : {} }", entityPath.getClass().getSimpleName(), fieldName);
            return null;
        }
    }

    // 필드의 데이터 타입을 알아내는 메서드
    private static QueryPath getEntityFieldType(Path<?> entityPath, final String fieldName) throws NoSuchFieldException {
        // 현재 클래스의 필드 확인
        boolean entityPathType = Arrays.stream(entityPath.getType().getDeclaredFields())
                .anyMatch(field -> field.getName().equalsIgnoreCase(fieldName));
        if (entityPathType) {
            return QueryPath.of(entityPath.getType().getDeclaredField(fieldName));
        }

        // 부모 클래스의 필드 확인
        boolean entityPathSuperType = Arrays.stream(entityPath.getType().getSuperclass().getDeclaredFields())
                .anyMatch(field -> field.getName().equalsIgnoreCase(fieldName));
        if (entityPathSuperType) {
            return QueryPath.of(entityPath.getType().getSuperclass().getDeclaredField(fieldName));
        }

        throw new NoSuchFieldException();
    }

    private Object parse(String valueStr) {
        ObjectMapper objectMapper = new ObjectMapper();
        if (this.queryPath.getType().equals(LocalDateTime.class)) {
            return this.parseLocalDateTime(valueStr);
        } else {
            return this.queryPath.getType().equals(LocalDate.class) ? this.parseLocalDate(valueStr) : objectMapper.convertValue(valueStr, this.queryPath.getType());
        }
    }

    private Predicate makeLikePredicate(String value) {
        switch (this.queryPath.getType().getSimpleName()) {
            case "Long":
                return this.builder.getNumber(this.queryPath.getName(), Long.class).like(value);
            case "Integer":
                return this.builder.getNumber(this.queryPath.getName(), Integer.class).like(value);
            case "Double":
                return this.builder.getNumber(this.queryPath.getName(), Double.class).like(value);
            case "Float":
                return this.builder.getNumber(this.queryPath.getName(), Float.class).like(value);
            default:
                return this.builder.getString(this.queryPath.getName()).like(value);
        }
    }

    public Predicate equal(String valueStr) {
        return this.builder.get(this.queryPath.getName()).eq(this.parse(valueStr));
    }

    public Predicate like(String valueStr) {
        String value = "%" + this.parse(valueStr) + "%";
        return this.makeLikePredicate(value);
    }

    private LocalDate parseLocalDate(String dateStr) {
        if (DateUtils.validationDate(dateStr, "yyyyMMdd")) {
            return DateUtils.parseLocalDate(dateStr, "yyyyMMdd");
        } else if (DateUtils.validationDate(dateStr, "yyyyMMddHHmmss")) {
            return DateUtils.parseLocalDate(dateStr, "yyyyMMddHHmmss");
        } else if (DateUtils.validationDate(dateStr, "yyyy-MM-dd HH:mm:ss")) {
            return DateUtils.parseLocalDate(dateStr, "yyyy-MM-dd HH:mm:ss");
        } else if (DateUtils.validationDate(dateStr, "yyyy-MM-dd")) {
            return DateUtils.parseLocalDate(dateStr, "yyyy-MM-dd");
        } else if (DateUtils.validationDate(dateStr, "yyyy-MM-ddTHH:mm:ss.SSS'Z'")) {
            return DateUtils.parseLocalDate(dateStr, "yyyy-MM-ddTHH:mm:ss.SSS'Z'");
        } else if (DateUtils.validationDate(dateStr, "yyyy-MM-ddTHH:mm:ss.SSS")) {
            return DateUtils.parseLocalDate(dateStr, "yyyy-MM-ddTHH:mm:ss.SSS");
        } else {
            throw new IllegalArgumentException("요청 날짜 포멧 오류.");
        }
    }

    private LocalDateTime parseLocalDateTime(String dateStr) {
        if (DateUtils.validationDate(dateStr, "yyyyMMdd")) {
            return DateUtils.parseLocalDateTime(dateStr, "yyyyMMdd");
        } else if (DateUtils.validationDate(dateStr, "yyyyMMddHHmmss")) {
            return DateUtils.parseLocalDateTime(dateStr, "yyyyMMddHHmmss");
        } else if (DateUtils.validationDate(dateStr, "yyyy-MM-dd HH:mm:ss")) {
            return DateUtils.parseLocalDateTime(dateStr, "yyyy-MM-dd HH:mm:ss");
        } else if (DateUtils.validationDate(dateStr, "yyyy-MM-dd")) {
            return DateUtils.parseLocalDateTime(dateStr, "yyyy-MM-dd");
        } else if (DateUtils.validationDate(dateStr, "yyyy-MM-ddTHH:mm:ss.SSS'Z'")) {
            return DateUtils.parseLocalDateTime(dateStr, "yyyy-MM-ddTHH:mm:ss.SSS'Z'");
        } else if (DateUtils.validationDate(dateStr, "yyyy-MM-ddTHH:mm:ss.SSS")) {
            return DateUtils.parseLocalDateTime(dateStr, "yyyy-MM-ddTHH:mm:ss.SSS");
        } else {
            throw new IllegalArgumentException("요청 날짜 포멧 오류.");
        }
    }

}

