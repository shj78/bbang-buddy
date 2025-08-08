package com.bbangbuddy.domain.notification.api;

import com.bbangbuddy.domain.notification.domain.Notification;
import com.bbangbuddy.domain.notification.dto.NotificationRequestDto;
import com.bbangbuddy.domain.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.List;

/**
 * @PackageName : com.bbangbuddy.domain.notification.api
 * @FileName : NotificationApi
 * @Author : hjsim
 * @Date : 2025-06-11
 * @Description :  알림 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationApi {

    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> getNotifications(@RequestParam("token") String token) {
        return notificationService.getNotifications(token);
    }

    /**
     * SSE를 통해 알림을 구독하는 엔드포인트
     * @param token 사용자 토큰
     * @return SseEmitter 객체
     */
    @CrossOrigin(origins = {"http://localhost:3000", "http://158.180.88.31:3000"})
    @GetMapping("/subscribe")
    public SseEmitter subscribe(@RequestParam("token") String token, HttpServletResponse response) {
        response.setHeader("X-Accel-Buffering", "no");
        return notificationService.subscribe(token);
    }

    /**
     * 알림을 전송하는 엔드포인트
     * @param request 알림 전송 요청
     */
    @CrossOrigin(origins = {"http://localhost:3000", "http://158.180.88.31:3000"})
    @PostMapping("/send")
    public void send(@Valid @RequestBody NotificationRequestDto request) {
        notificationService.send(request.getUserId(), request.getMessage());
    }

    /**
     * 특정 알림을 읽음 처리하는 엔드포인트
     * @param notificationId 사용자 ID
     */
    @PutMapping("/read-all/{notificationId}")
    public void markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
    }

}

