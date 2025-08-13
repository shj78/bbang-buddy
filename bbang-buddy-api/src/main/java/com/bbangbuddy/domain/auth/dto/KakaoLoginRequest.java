package com.bbangbuddy.domain.auth.dto;

import lombok.Getter;

import javax.validation.constraints.NotBlank;

/**
 * @PackageName : com.bbangbuddy.domain.auth.dto
 * @FileName : FirebaseLoginRequest
 * @Author : hjsim
 * @Date : 2025-07-01
 * @Description :  카카오 로그인 시 요청 DTO
 */
@Getter
public class KakaoLoginRequest {

    @NotBlank(message = "토큰은 필수입니다")
    private String token;

}
