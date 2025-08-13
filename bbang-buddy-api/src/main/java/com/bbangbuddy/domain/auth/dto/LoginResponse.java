package com.bbangbuddy.domain.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @PackageName : com.bbangbuddy.domain.auth.dto
 * @FileName : LoginResponse
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description :  로그인 성공 시 클라이언트에게 응답으로 줄 데이터
 */
@Getter
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;

}
