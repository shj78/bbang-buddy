package com.bbangbuddy.domain.pot.api;

import com.bbangbuddy.domain.notification.service.NotificationService;
import com.bbangbuddy.global.util.ApplicationContextUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bbangbuddy.domain.pot.dto.PotParticipantDto;
import com.bbangbuddy.domain.pot.service.PotParticipantService;
import java.util.List;

/**
 * @PackageName : com.bbangbuddy.domain.pot.api
 * @FileName : PotParticipantApi
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 팟 참가자 관련 API를 처리하는 컨트롤러
 */
@RestController
@RequestMapping("/api/participant")
@RequiredArgsConstructor
public class PotParticipantApi {

    private final PotParticipantService potParticipantService;
    private final NotificationService notificationService;

    /**
     * 팟 참가자 전체 조회
     *
     * @return 팟 참가자 목록
     */
    @GetMapping("/all")
    public List<PotParticipantDto.Response> getAllPotParticipants() {
        return potParticipantService.getAllPotParticipants();
    }

    /**
     * 팟 ID로 팟 참가자를 조회
     *
     * @param search 검색 조건 (팟 ID)
     * @return 팟 참가자 목록
     */
    @PostMapping("/by-pot")
    public List<PotParticipantDto.Response> getPotParticipantsByPotId(@RequestBody PotParticipantDto.Search search) {
        return potParticipantService.getPotParticipantsByPotId(search.getPotId());
    }

    /**
     * 사용자 ID로 팟 참가자를 조회
     *
     * @param search 검색 조건 (사용자 ID)
     * @return 팟 참가자 목록
     */
    @PostMapping("/by-user")
    public List<PotParticipantDto.Response> getPotParticipantsByUserId(@RequestBody PotParticipantDto.Search search) {
        return potParticipantService.getPotParticipantsByUserId(search.getUserId());
    }


    /**
     * 팟 참가자 추가
     *
     * @param request 팟 참가자 요청
     * @return 성공 메시지
     */
    @PostMapping
    public ResponseEntity<Object> savePotParticipant(@RequestBody PotParticipantDto.Request request) {
        potParticipantService.savePotParticipant(request);
        return ResponseEntity.ok("팟 참가자가 성공적으로 추가되었습니다.");
    }

    /**
     * 팟 참가자 삭제
     *
     * @param potId 탈퇴할 팟 ID
     * @return 성공 메시지
     */
    @DeleteMapping("{potId}")
    public ResponseEntity<Object> deletePotParticipant(@PathVariable Long potId) {
        potParticipantService.deletePotParticipant(potId,ApplicationContextUtils.getUserId());
        return ResponseEntity.ok("팟 참가자가 성공적으로 삭제되었습니다.");
    }

}