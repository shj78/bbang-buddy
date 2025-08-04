//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.bbangbuddy.global.util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * @PackageName : com.bbangbuddy.global.util
 * @FileName : StringUtils
 * @Author : hjsim
 * @Date : 2025-06-10
 * @Description : 문자열 관련 유틸리티 클래스
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class StringUtils {

    private static final String SPECIAL_CHARACTERS_REGEX = "['\"~!@#$%^&*()_+\\-={}\\[\\]:;,.<>/|?\\\\]";

    public static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    public static String removeSpecialCharacters(String value) {
        return value.replaceAll(SPECIAL_CHARACTERS_REGEX, "");
    }

}

