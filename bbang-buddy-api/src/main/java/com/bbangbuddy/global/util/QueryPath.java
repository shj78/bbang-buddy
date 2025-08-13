//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//
package com.bbangbuddy.global.util;

import java.lang.reflect.Field;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * @PackageName : com.bbangbuddy.global.util
 * @FileName : QueryPath
 * @Author : hjsim
 * @Date : 2025-06-10
 * @Description : Querydsl에서 사용되는 엔티티의 필드와 문자열 경로를 매핑하는 클래스
 */
@Slf4j
@Getter
public class QueryPath {

    private final Field entityField;
    private final String stringPath;

    private QueryPath(Field entityField, String stringPath) {
        this.entityField = entityField;
        this.stringPath = stringPath;
    }

    public static QueryPath of(Field entityField) {
        return new QueryPath(entityField, "");
    }

    public Class<?> getType() {
        return this.entityField.getType();
    }

    public String getName() {
        return StringUtils.isBlank(this.stringPath) ? this.entityField.getName() : this.stringPath + "." + this.entityField.getName();
    }

}
