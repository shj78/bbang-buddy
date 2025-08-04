package com.bbangbuddy.domain.notification.repository;

import com.bbangbuddy.domain.notification.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @PackageName : com.bbangbuddy.domain.notification.repository
 * @FileName : NotificationRepository
 * @Author : hjsim
 * @Date : 2025-07-21
 * @Description :  <br>
 */
public interface NotificationRepository extends JpaRepository<Notification, String> {


    @Override
    List<Notification> findAll();

    /**
     * 알림을 사용자 ID로 조회하는 메소드
     *
     * @param userId 사용자 ID
     * @return 알림 목록
     */
    List<Notification> findByUserId(String userId);




    /**
     * 알림을 읽음 상태로 업데이트하는 메소드
     *
     * @param notificationId 알림 ID
     */
    @Transactional
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId")
    void markAsRead(@Param("notificationId") Long notificationId);
}
