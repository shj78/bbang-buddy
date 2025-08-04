package com.bbangbuddy.domain.pot.service;

import com.bbangbuddy.domain.notification.service.TelegramService;
import com.bbangbuddy.domain.pot.domain.Pot;
import com.bbangbuddy.domain.pot.domain.PotParticipant;
import com.bbangbuddy.domain.pot.dto.PotDto;
import com.bbangbuddy.domain.pot.repository.PotParticipantRepository;
import com.bbangbuddy.domain.pot.repository.PotRepository;
import com.bbangbuddy.domain.pot.repository.PotRepositorySupport;
import com.bbangbuddy.domain.user.domain.User;
import com.bbangbuddy.domain.user.repository.UserRepository;
import com.bbangbuddy.global.util.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @PackageName : com.bbangbuddy.domain.pot.service
 * @FileName : PotService
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 팟 CRUD 및 관련 비즈니스 로직 처리 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PotService {

    private final PotRepository potRepository;
    private final PotParticipantRepository potParticipantRepository;
    private final UserRepository userRepository;
    private final FileService fileService;
    private final PotRepositorySupport potRepositorySupport;
    private final TelegramService telegramService;

    /**
     * 팟 목록 조회
     *
     * @return 조회된 팟 목록
     */
    public List<Pot> getAllPots() {
        return potRepository.findAll();
    }

    /**
     * 검색 조건을 가진 팟 목록 조회
     *
     * @return 조회된 팟 목록
     */
    public List<PotDto.Response> searchPots(String keyword) {
        PotDto.Search search = PotDto.Search.builder()
                .title(keyword)
                .description(keyword)
                .address(keyword)
                .build();

        return potRepositorySupport.findBySearchCondition(search);
    }

    /**
     * 근처 팟 목록 조회
     */
    public List<PotDto.Response> getNearPotList(double latitude, double longitude, int distance) {
        // TODO: 거리 계산 로직 구현 필요
        // 예: Haversine 공식을 사용하여 현재 위치와의 거리 계산
        return potRepository.findNearbyPots(latitude, longitude, distance).stream()
                .map(PotDto.Response::from)
                .collect(Collectors.toList());
    }

    /**
     * userId로 팟 조회
     *
     * @param userId  조회할 팟 ID 목록
     * @return 조회된 팟 목록
     */
    public List<PotDto.Response> getMyPotList(String userId) {
        List<PotParticipant> participations = potParticipantRepository.findByUserId(userId);

        List<Long> potIds = participations.stream()
                .map(PotParticipant::getPotId)
                .collect(Collectors.toList());

        return potRepository.findAllById(potIds)
                .stream()
                .map(PotDto.Response::from)
                .collect(Collectors.toList());
    }

    /**
     * 팟 생성 또는 수정 (upsert)
     *
     * @param upsert 생성 또는 수정할 팟 정보
     * @param userId 생성 시 필요한 유저 ID
     * @return 생성 또는 수정된 팟의 ID
     */
    @Transactional
    public Long upsertPot(PotDto.Upsert upsert, MultipartFile image, String userId) {
        try {
            processImage(upsert, image);

            return upsert.getId() == null
                    ? createNewPot(upsert, userId)
                    : updateExistingPot(upsert);


        } catch (Exception e) {
            throw new RuntimeException("팟 저장에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 팟 이미지 처리
     *
     * @param upsert 팟 업서트 DTO
     * @param image  업로드된 이미지 파일
     * @description 이미지가 존재하면 업서트 객체에 설정
     */
    private void processImage(PotDto.Upsert upsert, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            upsert.setImage(image);
        }
    }

    /**
     * 새로운 팟 생성
     *
     * @param upsert 생성할 팟 정보
     * @param userId 생성 시 필요한 유저 ID
     * @return 생성된 팟의 ID
     * @throws IOException 이미지 저장 중 오류 발생 시
     */
    private Long createNewPot(PotDto.Upsert upsert, String userId) throws IOException {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Pot pot = null;
        try {
            pot = createPotWithImage(upsert, user.getId());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        Pot savedPot = potRepository.save(pot);
        // 팟 참가자 정보 생성
        PotParticipant participant = PotParticipant.builder()
                .potId(savedPot.getId())
                .userId(user.getUserId())
                .build();
        potParticipantRepository.save(participant);

        telegramService.sendTelegramMessage("새로운 팟이 생성되었습니다: " + upsert.getTitle());
        return savedPot.getId();
    }

    /**
     * 기존 팟 업데이트
     *
     * @param upsert 수정할 팟 정보
     * @return 수정된 팟의 ID
     * @throws RuntimeException 팟을 찾을 수 없는 경우
     */
    private Long updateExistingPot(PotDto.Upsert upsert) {
        Pot pot = potRepository.findById(upsert.getId())
                .orElseThrow(() -> new RuntimeException("팟을 찾을 수 없습니다."));

        pot.updateFromDto(upsert);
        return potRepository.save(pot).getId();
    }

    /**
     * 팟 생성 시 이미지 처리
     *
     * @param upsert 팟 업서트 DTO
     * @param userId 생성 시 필요한 유저 ID
     * @return 생성된 팟 엔티티
     * @throws IOException 이미지 저장 중 오류 발생 시
     */
    private Pot createPotWithImage(PotDto.Upsert upsert, Long userId) throws IOException {
        Pot pot = upsert.toEntity(userId);

        if (upsert.getImage() != null) {
            String imagePath = null;
            try {
                imagePath = fileService.saveImage(upsert.getImage());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            pot = pot.toBuilder()
                    .createdBy(userId)
                    .imagePath(imagePath)
                    .originalFileName(upsert.getImage().getOriginalFilename())
                    .build();
        }

        return pot;
    }

    /**
     * 팟 삭제
     *
     * @param id 삭제할 팟 ID
     * @throws RuntimeException 팟을 찾을 수 없는 경우
     */
    @Transactional
    public void deletePot(Long id) {
        potRepository.findById(id)
                .orElseThrow(() ->  new RuntimeException("팟을 찾을 수 없습니다."));
        potRepository.deleteById(id);
    }

}