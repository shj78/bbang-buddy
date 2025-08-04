package com.bbangbuddy.domain.user.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * @PackageName : com.bbangbuddy.domain.user.domain
 * @FileName : User
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 사용자 정보를 저장하는 엔티티 클래스
 */
@Entity
@Table(
        name = "BBD_USER",
        uniqueConstraints = {
                @UniqueConstraint(name = "UK_BBD_USER_USERNAME", columnNames = "USERNAME"),
                @UniqueConstraint(name = "UK_BBD_USER_EMAIL", columnNames = "EMAIL"),
                @UniqueConstraint(name = "UK_BBD_USER_USER_ID", columnNames = "USER_ID")
        }
)
@Getter
@Setter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false, updatable = false)
    private Long id;

    @Column(name = "USER_ID", length = 50, nullable = false)
    private String userId;

    @Column(name = "PASSWORD_HASH", length = 255, nullable = true)
    private String passwordHash;

    //UI에서는 닉네임으로 표시됨, OAuth 가입시 이메일이 들어가고 스프링 시큐리티 가입시 닉네임값이 들어감
    @Column(name = "USERNAME", length = 50, nullable = false)
    private String username;

    @Column(name = "EMAIL", length = 100, nullable = false)
    private String email;

    @Column(name = "UID", length = 20)
    private String uid; // Firebase UID

    @Column(name = "PROVIDER", length = 20, nullable = false)
    private String provider; // OAuth provider (e.g., "google", "kakao", local)

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ROLE_ID", nullable = false)
    private Role roleId;

    @Column(name = "LAST_LOGIN_AT")
    private LocalDateTime lastLoginAt;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "DELETED_AT")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}