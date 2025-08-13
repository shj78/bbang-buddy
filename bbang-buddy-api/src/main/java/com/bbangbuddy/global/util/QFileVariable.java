package com.bbangbuddy.global.util;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @PackageName : com.bbangbuddy.global.util
 * @FileName : QFileVariable
 * @Author : hjsim
 * @Date : 2025-06-10
 * @Description : Q파일명, 필드, 제외 여부를 매핑하는 데 사용하는 어노테이션
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface QFileVariable {

    String qClassName() default "";

    String field() default "";

    boolean exclusion() default false;

}