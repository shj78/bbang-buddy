package com.bbangbuddy.domain.user.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * @PackageName : com.bbangbuddy.domain.user.dto
 * @FileName : EmailUpdateRequest
 * @Author : hjsim
 * @Date : 2025-07-07
 * @Description :  <br>
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmailUpdateRequest {
    private String newEmail;
}