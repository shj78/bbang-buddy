package com.bbangbuddy.domain.auth.dto;

import lombok.Getter;
import javax.validation.constraints.NotBlank;

/**
 * @PackageName : com.bbangbuddy.domain.auth.dto
 * @FileName : FirebaseLoginRequest
 * @Author : hjsim
 * @Date : 2025-07-01
 * @Description :  Firebase ID 토큰을 이용한 로그인 요청 DTO
 */
@Getter
public class FirebaseLoginRequest {

    @NotBlank(message = "ID 토큰은 필수입니다")
    private String idToken;

}
