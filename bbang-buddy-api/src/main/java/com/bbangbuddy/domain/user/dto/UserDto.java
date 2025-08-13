package com.bbangbuddy.domain.user.dto;

import com.bbangbuddy.domain.user.domain.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;
import java.time.LocalDateTime;

/**
 * @PackageName : com.bbangbuddy.domain.user.dto
 * @FileName : UserDto
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 사용자 관련 DTO
 */
public class UserDto {

    @Getter
    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Detail {
        private Long id;                  // 사용자 ID
        private String userId;            // 사용자 아이디
        private String passwordHash;      // 비밀번호 해시
        private String username;          // 사용자 이름
        private String email;             // 사용자 이메일
        private Long roleId;              // 역할 ID
        private LocalDateTime lastLoginAt; // 마지막 로그인 시간
        private LocalDateTime createdAt;   // 생성일시
        private LocalDateTime updatedAt;   // 수정일시
        private LocalDateTime deletedAt;   // 삭제일시
    }

    @Getter
    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Upsert {
        private Long id;                  // 사용자 ID
        private String userId;            // 사용자 아이디
        private String username;          // 사용자 이름
        private String passwordHash;          // 비밀번호
        private String email;             // 사용자 이메일
        private Role roleId;              // 역할 ID
        private LocalDateTime lastLoginAt; // 마지막 로그인 시간
        private LocalDateTime createdAt;   // 생성일시
        private LocalDateTime updatedAt;   // 수정일시
        private LocalDateTime deletedAt;   // 삭제일시
    }

}