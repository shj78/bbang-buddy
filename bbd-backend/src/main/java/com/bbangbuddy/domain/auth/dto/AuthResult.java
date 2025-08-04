package com.bbangbuddy.domain.auth.dto;

import com.bbangbuddy.domain.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * @PackageName : com.bbangbuddy.domain.auth.dto
 * @FileName : AuthResponse
 * @Author : hjsim
 * @Date : 2025-07-01
 * @Description :  스프링 시큐리티 인증 응답 DTO
 */
@Builder
@Getter
@AllArgsConstructor
public class AuthResult {
    private final User user;
    private final String jwtToken;
}
