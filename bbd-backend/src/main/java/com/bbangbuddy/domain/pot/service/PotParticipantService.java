package com.bbangbuddy.domain.pot.service;

import com.bbangbuddy.domain.notification.domain.Notification;
import com.bbangbuddy.domain.notification.repository.NotificationRepository;
import com.bbangbuddy.domain.notification.service.NotificationService;
import com.bbangbuddy.domain.pot.dto.PotParticipantDto;
import com.bbangbuddy.domain.pot.domain.Pot;
import com.bbangbuddy.domain.pot.domain.PotParticipant;
import com.bbangbuddy.domain.pot.repository.PotParticipantRepository;
import com.bbangbuddy.domain.pot.repository.PotRepository;
import com.bbangbuddy.domain.user.domain.User;
import com.bbangbuddy.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @PackageName : com.bbangbuddy.domain.pot.service
 * @FileName : PotParticipantService
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 팟 참가자 등록, 조회, 삭제 등의 비즈니스 로직 처리 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PotParticipantService {

    private final PotParticipantRepository potParticipantRepository;
    private final NotificationRepository notificationRepository;
    private final PotRepository potRepository;
    private final UserRepository userRepository;

    private final NotificationService notificationService;
    /**
     * 팟 참가
     * - 팟과 사용자 존재 여부 확인
     * - 팟 정원 초과 여부 확인
     * - 중복 참가 여부 확인
     *
     * @param request 팟 참가 요청 정보
     * @throws RuntimeException 팟/사용자가 없거나, 정원 초과, 또는 중복 참가인 경우
     */
    @Transactional
    public void savePotParticipant(PotParticipantDto.Request request) {
        String userId = request.getUserId();
        Long potId = request.getPotId();

        Pot pot = potRepository.findById(potId)
            .orElseThrow(() -> new RuntimeException("팟을 찾을 수 없습니다."));

        userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (pot.getCurrentParticipants() >= pot.getMaxParticipants()) {
            throw new RuntimeException("정원이 초과된 팟입니다.");
        }

        if (potParticipantRepository.existsPotParticipant(potId, userId)) {
            throw new RuntimeException("이미 참가한 팟입니다.");
        }

        PotParticipant participant = request.toEntity();
        potParticipantRepository.save(participant);

        List<PotParticipant> participants = potParticipantRepository.findByPotId(request.getPotId());

        List<Notification> notifications = new ArrayList<>();
        for (PotParticipant notificationSubject : participants) {
            Notification notification = Notification.builder()
                    .userId(notificationSubject.getUserId())
                    .title(pot.getTitle()) // 팟 제목 저장
                    .message(pot.getTitle() + " 에 " + request.getNotificationMessage())
                    .isRead(false)
                    .build();
            notifications.add(notificationRepository.save(notification));

            // 알림을 JSON 형태로 변환 (예시)
            String data = "{\"id\":\"" + notification.getId() + "\","
                    + "\"type\":\"notification\","
                    + "\"title\":\"" + notification.getTitle() + "\","
                    + "\"message\":\"" + notification.getMessage() + "\","
                    + "\"createdAt\":\"" + notification.getCreatedAt() + "\","
                    + "\"read\":" + notification.isRead() + "}";
            notificationService.send(notification.getUserId(), data);
        }
    }

    /**
     * 모든 팟 참가자 정보를 조회합니다.
     *
     * @return 전체 팟 참가자 목록
     */
    public List<PotParticipantDto.Response> getAllPotParticipants() {
        List<PotParticipant> participants = potParticipantRepository.findAll();
        return participants.stream()
            .map(PotParticipantDto.Response::from)
            .collect(Collectors.toList());
    }

    /**
     * 특정 팟의 참가자 목록을 조회
     *
     * @param potId 조회할 팟 ID
     * @return 해당 팟의 참가자 목록
     */
    public List<PotParticipantDto.Response> getPotParticipantsByPotId(Long potId) {
        List<PotParticipant> participants = potParticipantRepository.findByPotId(potId);
        return participants.stream()
                .map(PotParticipantDto.Response::from)
                .collect(Collectors.toList());
    }

    /**
     * 특정 사용자가 참가한 팟 목록을 조회
     *
     * @param userId 조회할 사용자 ID
     * @return 해당 사용자가 참가한 팟 목록
     */
    public List<PotParticipantDto.Response> getPotParticipantsByUserId(String userId) {
        List<PotParticipant> participants = potParticipantRepository.findByUserId(userId);
        return participants.stream()
                .map(PotParticipantDto.Response::from)
                .collect(Collectors.toList());
    }

    /**
     * 팟 탈퇴
     *
     * @param potId 취소할 팟 ID
     * @param userId 취소할 사용자 ID
     * @throws RuntimeException 해당하는 팟 참가자 정보가 없는 경우
     */
    @Transactional
    public void deletePotParticipant(Long potId, String userId) {
        List<PotParticipant> participants = potParticipantRepository.findByPotIdAndUserId(potId, userId);

        Pot pot = potRepository.findById(potId)
                .orElseThrow(() -> new RuntimeException("팟을 찾을 수 없습니다."));

        PotParticipant participant = participants.stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("팟 참가자를 찾을 수 없습니다."));

        potParticipantRepository.delete(participant);

        List<Notification> notifications = new ArrayList<>();
        for (PotParticipant notificationSubject : participants) {
            Notification notification = Notification.builder()
                    .userId(notificationSubject.getUserId())
                    .title(pot.getTitle()) // 팟 제목 저장
                    .message(pot.getTitle() + " 에 "+ userId + " 님이 탈퇴하였습니다.")
                    .isRead(false)
                    .build();
            notifications.add(notificationRepository.save(notification));

            // 알림을 JSON 형태로 변환 (예시)
            String data = "{\"id\":\"" + notification.getId() + "\","
                    + "\"type\":\"notification\","
                    + "\"title\":\"" + notification.getTitle() + "\","
                    + "\"message\":\"" + notification.getMessage() + "\","
                    + "\"createdAt\":\"" + notification.getCreatedAt() + "\","
                    + "\"read\":" + notification.isRead() + "}";
            notificationService.send(notification.getUserId(), data);
        }
    }

}