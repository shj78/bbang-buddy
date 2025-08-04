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
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean isRead = false;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
