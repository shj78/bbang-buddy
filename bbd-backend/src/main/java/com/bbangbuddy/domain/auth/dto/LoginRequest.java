package com.bbangbuddy.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;

import javax.validation.constraints.NotBlank;

/**
 * @PackageName : com.bbangbuddy.domain.auth.dto
 * @FileName : LoginRequest
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description :  로그인 요청 시 클라이언트가 보내는 데이터
 */
@Getter
@Builder
public class LoginRequest {

    @NotBlank(message = "아이디를 입력해주세요")
    private String userId;   // 로그인 아이디 (ID or email)

    @NotBlank(message = "비밀번호를 입력해주세요")
    private String password;

}
