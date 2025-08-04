package com.bbangbuddy.global.util;

import java.util.Arrays;
import java.util.regex.Pattern;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * @PackageName : com.bbangbuddy.global.util
 * @FileName : QueryOperator
 * @Author : hjsim
 * @Date : 2025-06-10
 * @Description : 쿼리에서 사용되는 연산자들을 정의한 enum 클래스
 */
@Slf4j
@Getter
public enum QueryOperator {

    LIKE(" like '%%%s%%' ", Pattern.compile("%([^%]+)%")),
    LIKE_START_WITH(" like '%s%%' ", Pattern.compile("^[^%]*%$")),
    LIKE_END_WITH(" like '%%%s' ", Pattern.compile("^%[^%]*$")),
    EQUAL(" = '%s' ", null);

    private final String expression;
    private final Pattern pattern;  // 필드명 변경

    private QueryOperator(String expression, Pattern pattern) {  // 매개변수명 변경
        this.expression = expression;
        this.pattern = pattern;
    }

    public static QueryOperator findOperator(String input) {
        return Arrays.stream(values())
                .filter(op -> op.pattern != null && op.pattern.matcher(input).find())
                .findFirst()
                .orElse(EQUAL);
    }

}
