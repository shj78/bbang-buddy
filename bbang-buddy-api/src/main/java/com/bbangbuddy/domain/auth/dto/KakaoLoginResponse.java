package com.bbangbuddy.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * @PackageName : com.bbangbuddy.domain.auth.dto
 * @FileName : FirebaseLoginRequest
 * @Author : hjsim
 * @Date : 2025-07-01
 * @Description :  카카오 로그인 시 응답 DTO
 */
@Getter
@Builder
public class KakaoLoginResponse {
    private String kakaoAccessToken;
    private String jwtToken;
    private User user;

    @Getter
    @Setter
    @Builder
    public static class User {
        private String email;
        private String nickname;
        private String profileImage;
        private String userId;
        private String provider;
        private LocalDateTime createdAt;
    }
}
