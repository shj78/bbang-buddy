package com.bbangbuddy.domain.notification.service;

import com.bbangbuddy.domain.auth.jwt.JwtUtil;
import javax.annotation.PreDestroy;

import com.bbangbuddy.domain.notification.domain.Notification;
import com.bbangbuddy.domain.notification.dto.NotificationRequestDto;
import com.bbangbuddy.domain.notification.repository.NotificationRepository;
import com.bbangbuddy.domain.pot.domain.Pot;
import com.bbangbuddy.domain.pot.domain.PotParticipant;
import com.bbangbuddy.domain.pot.dto.PotParticipantDto;
import com.bbangbuddy.domain.pot.repository.PotParticipantRepository;
import com.bbangbuddy.domain.pot.repository.PotRepository;
import com.bbangbuddy.global.util.ApplicationContextUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @PackageName : com.bbangbuddy.domain.notification.service
 * @FileName : NotificationService
 * @Author : hjsim
 * @Date : 2025-06-11
 * @Description : 알림 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JwtUtil jwtUtil;
    private final NotificationRepository notificationRepository;
    private final PotRepository potRepository;
    private final PotParticipantRepository potParticipantRepository;

    // 사용자별 emitter 저장소
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    // 알림 목록 조회 (임시 구현)
    public List<Notification> getNotifications(String token) {
        // 실제 구현에서는 토큰에서 userId 추출 후 DB에서 알림 조회
        String userId = jwtUtil.getUserIdFromToken(token);
        return notificationRepository.findByUserId(userId);
    }

    /**
     * 알림 생성 메서드
     * @param request 알림 생성 요청 DTO
     * @return 생성된 Notification 객체
     */
    public void createNotification(PotParticipantDto.Request request) {
        List<PotParticipant> participants = potParticipantRepository.findByPotId(request.getPotId());

        // potId로 팟 정보 조회 (예: potRepository.findById)
        Pot pot = potRepository.findById(request.getPotId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 팟"));
        List<Notification> notifications = new ArrayList<>();
        for (PotParticipant participant : participants) {
            Notification notification = Notification.builder()
                .userId(participant.getUserId())
                .title(pot.getTitle()) // 팟 제목 저장
                .message(pot.getTitle()+" 팟에 "+ request.getNotificationMessage())
                .isRead(false)
                .build();
            notifications.add(notificationRepository.save(notification));
        }
    }

    /**
     * SSE를 통해 알림을 구독하는 메서드
     * @param token 사용자 토큰
     * @return SseEmitter 객체
     */
    @CrossOrigin(origins = {"http://localhost:3000", "http://158.180.88.31:3000"})
    public SseEmitter subscribe(String token) {
        String userId = jwtUtil.getUserIdFromToken(token);
        log.info("🛰️ 구독 요청됨 userId = " + userId);
        SseEmitter emitter = new SseEmitter(60 * 60 * 1000L); // 1시간 타임아웃
        emitters.put(userId, emitter);

        // 종료 및 에러 처리
        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError((e) -> emitters.remove(userId));

        return emitter;
    }

    /**
     * 사용자에게 알림 메시지를 전송하는 메서드
     * @param userId 사용자 ID
     * @param message 전송할 메시지
     */
    public void send(String userId, String message) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .data(message));
            } catch (IOException e) {
                emitter.completeWithError(e);
                emitters.remove(userId);
            }
        }
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.markAsRead(notificationId);
        log.info("알림 읽음 처리: userId = {}", notificationId);
    }

    @PreDestroy
    public void cleanup() {
        emitters.clear();
    }

}

