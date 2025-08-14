package com.bbangbuddy.domain.notification.domain;

import lombok.*;
import org.checkerframework.checker.units.qual.A;
import org.springframework.web.bind.annotation.RequestBody;

import javax.persistence.*;
import java.time.LocalDateTime;
/**
 * @PackageName : com.bbangbuddy.domain.notification.domain
 * @FileName : Notification
 * @Author : hjsim
 * @Date : 2025-07-21
 * @Description :  알림 엔티티 클래스
 */
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Table(name = "NOTIFICATION")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(nullable = false, name = "TITLE")
    private String title;

    @Column(nullable = false, name = "USER_ID")
    private String userId;

    @Column(nullable = false, name = "MESSAGE")
    private String message;

    @Column(nullable = false, name="CREATED_AT")
    private LocalDateTime createdAt;

    @Column(nullable = false, name="IS_READ")
    private boolean isRead;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
