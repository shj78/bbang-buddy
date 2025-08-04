package com.bbangbuddy.domain.pot.api;

import com.bbangbuddy.domain.pot.dto.PotDto;
import com.bbangbuddy.domain.pot.service.PotService;
import com.bbangbuddy.global.util.ApplicationContextUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

/**
 * @PackageName : com.bbangbuddy.domain.pot.api
 * @FileName : PotApi
 * @Author : hjsim
 * @Date :
 * @Description : 빵팟의 등록, 수정, 삭제, 조회 등을 위한 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/pot")
@RequiredArgsConstructor
public class PotApi {

    private final PotService potService;

    /**
     * 모든 팟 목록 조회
     *
     * @return 팟 목록
     */
    @GetMapping
    public ResponseEntity<Object> getAllPots() {
        return ResponseEntity.ok(potService.getAllPots());
    }

    /**
     * 조건별 팟 목록 조회
     *
     * @param keyword
     * @return 검색 조건에 맞는 팟 목록
     */
    @GetMapping("/search")
    public ResponseEntity<List<PotDto.Response>> searchPots(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(potService.searchPots(keyword));
    }

    /**
     * 팟 조회
     *
     * 현재 사용자가 참여하고 있는 팟 목록을 조회
     *
     * @return 팟 목록
     */
    @RequestMapping("my")
    @GetMapping
    public ResponseEntity<List<PotDto.Response>> getMyPotList() {
        String userId = ApplicationContextUtils.getUserId();
        return ResponseEntity.ok(potService.getMyPotList(userId));
    }

    /**
     * 근처 팟 조회
     *
     * 현재 사용자의 위치 기반으로 근처의 팟 목록을 조회
     *
     * @return 팟 목록
     */
    @GetMapping("near")
    public ResponseEntity<Object> getNearPotList(@RequestParam double latitude,
                                                 @RequestParam double longitude,
                                                 @RequestParam int distance) {
        return ResponseEntity
                .ok(potService.getNearPotList(latitude, longitude, distance));
    }


    /**
     * 팟 생성 또는 수정 (upsert)
     *
     * @param upsert 생성 또는 수정할 팟 정보
     * @return 생성 또는 수정된 팟의 ID
     */
    @PostMapping(value = "/upsert")
    public ResponseEntity<Object> upsertPot (
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "potData") PotDto.Upsert upsert) {
        String userId = ApplicationContextUtils.getUserId();
        return ResponseEntity.ok(potService.upsertPot(upsert, image, userId));
    }

    /**
     * 팟 삭제
     *
     * 특정 ID의 팟을 삭제
     *
     * @param id 삭제할 팟 정보 (ID)
     * @return 삭제 결과 (empty)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePot(@PathVariable Long id) {
        potService.deletePot(id);
        return ResponseEntity.noContent().build();
    }

}