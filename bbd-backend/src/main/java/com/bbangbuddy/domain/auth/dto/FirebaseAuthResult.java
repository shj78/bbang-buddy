package com.bbangbuddy.domain.auth.dto;

import com.bbangbuddy.domain.user.domain.User;
import lombok.Builder;
import lombok.Getter;

/**
 * @PackageName : com.bbangbuddy.domain.auth.dto
 * @FileName : FirebaseAuthResult
 * @Author : hjsim
 * @Date : 2025-07-23
 * @Description :  파이어페이스 계정 DB 내 인증 결과 DTO
 */
@Getter
@Builder
public class FirebaseAuthResult {
    private final User user;
    private final String jwtToken;
}
