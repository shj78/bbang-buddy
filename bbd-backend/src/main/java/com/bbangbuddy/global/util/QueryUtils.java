package com.bbangbuddy.global.util;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.PathBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @PackageName : com.bbangbuddy.global.util
 * @FileName : QueryUtils
 * @Author : hjsim
 * @Date : 2025-06-10
 * @Description :  QueryDSL을 이용하여 정렬, 조건식, 쿼리표현식을 처리하는 유틸리티 클래스
 */
@Slf4j
public class QueryUtils {

    public static final String SORT_SEPARATOR = ",";
    public static final String SORT_DESC_SPECIAL_CHAR = "-";
    public static final String SORT_ASC_SPECIAL_CHAR = "+";

    // 정렬 파라미터들과 엔티티 경로를 받아서 정렬 조건을 OrderSpecifier 배열로 반환
    public static OrderSpecifier<?>[] getSortedColumnList(String sortString, Path<?> path) {
        Sort sort = makeSort(sortString);
        if (sort == null) {
            return new OrderSpecifier[0];
        }
        List<OrderSpecifier<?>> orderSpecifierList = sort.stream()
                .map(order -> makeOrderSpecifier(order, path))
                .collect(Collectors.toList());
        return orderSpecifierList.toArray(new OrderSpecifier[0]);
    }

    private static OrderSpecifier<?> makeOrderSpecifier(Sort.Order order, Path<?> entityPath) {
        Order direction = order.isAscending() ? Order.ASC : Order.DESC;
        PathBuilder<?> orderByExpression = new PathBuilder<>(entityPath.getClass(), entityPath.getMetadata().getName());
        return new OrderSpecifier(direction, orderByExpression.get(order.getProperty()));
    }

    // 검색 조건 관련
    public static Predicate getQueryExpression(Path<?> entityPath, final String fieldName, String parameter) {
        if (validateParameter(entityPath, fieldName, parameter)) {
            return null;
        }
        return makeExpression(entityPath, fieldName, parameter);
    }

    private static Predicate makeExpression(Path<?> entityPath, final String fieldName, String parameter) {
        QueryPathBuilder queryPathBuilder = QueryPathBuilder.of(entityPath, fieldName);
        if (queryPathBuilder == null) {
            return null;
        }

        QueryOperator operator = QueryOperator.findOperator(parameter);
        String cleanedParameter = parameter.replaceAll("%", "");

        return queryPathBuilder.like(cleanedParameter);
    }

    // 정렬 문자열 처리
    private static Sort makeSort(String sortString) {
        if (StringUtils.isBlank(sortString)) {
            return null;
        }

        List<Sort.Order> orders = Arrays.stream(sortString.split(SORT_SEPARATOR))
                .filter(QueryUtils::checkSortStr)
                .map(sortStr -> {
                    String replaceSortStr = StringUtils.removeSpecialCharacters(sortStr);
                    return sortStr.startsWith(SORT_DESC_SPECIAL_CHAR)
                            ? Sort.Order.desc(replaceSortStr)
                            : Sort.Order.asc(replaceSortStr);
                })
                .collect(Collectors.toList());

        return orders.isEmpty() ? null : Sort.by(orders);
    }

    private static boolean checkSortStr(String sortStr) {
        String replaceSortStr = StringUtils.removeSpecialCharacters(sortStr);
        return !replaceSortStr.isEmpty() &&
                (sortStr.startsWith(SORT_DESC_SPECIAL_CHAR) || sortStr.startsWith(SORT_ASC_SPECIAL_CHAR));
    }

    private static boolean validateParameter(Path<?> entityPath, final String fieldName, String parameter) {
        return entityPath == null ||
                StringUtils.isBlank(parameter) ||
                parameter.equalsIgnoreCase("null") ||
                parameter.equals("[]");
    }

}

