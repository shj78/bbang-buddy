package com.bbangbuddy.domain.user.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

/**
 * @PackageName : com.bbangbuddy.domain.user.dto
 * @FileName : PasswordUpdateRequest
 * @Author : hjsim
 * @Date : 2025-07-07
 * @Description :  <br>
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PasswordUpdateRequest {
    @NotBlank(message = "현재 비밀번호는 필수 입력값입니다.")
    private String currentPassword;
    @NotBlank(message = "새 비밀번호는 필수 입력값입니다.")
    private String newPassword;
}
