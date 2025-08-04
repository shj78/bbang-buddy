package com.bbangbuddy.domain.user.api;

import com.bbangbuddy.domain.notification.service.TelegramService;
import com.bbangbuddy.domain.user.dto.QandADto;
import com.bbangbuddy.domain.user.dto.EmailUpdateRequest;
import com.bbangbuddy.domain.user.dto.PasswordUpdateRequest;
import com.bbangbuddy.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.bbangbuddy.domain.user.domain.User;
import javax.validation.Valid;
import java.util.List;

/**
 * @PackageName : com.bbangbuddy.domain.user.api
 * @FileName : UserApi
 * @Author : hjsim
 * @Date : 2025-06-04
 * @Description : 사용자 정보 API를 처리하는 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserApi {

    private final UserService userService;
    private final TelegramService telegramService;

    /**
     * 전체 사용자 조회
     *
     * @return 전체 사용자 목록
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * 특정 사용자 조회
     *
     * @param id 사용자 ID
     * @return 사용자 정보
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 현재 로그인한 사용자 정보 조회
     *
     * @param userId 현재 로그인한 사용자의 ID
     * @return 현재 로그인한 사용자 정보
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal String userId) {
        return userService.getUserByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());//여기서 Spring은 ResponeEntity를 자동으로 JSON으로 변환하는데 이때 Jackson 컨버터가 사용된다.
    }

    @PostMapping("/me/qanda")
    public ResponseEntity<String> createQnA(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody QandADto question) {
        String msg = "[Q&A 문의]\n사용자: " + userId + "\n질문: " + question.getTitle()+"\n"+question.getDescription();
        telegramService.sendTelegramMessage("새로운 문의가 생성되었습니다: " + msg);
        log.info("Q&A 생성 요청: 사용자 ID = {}, 질문 = {}", userId, question);
        return ResponseEntity.ok("Q&A가 성공적으로 전송되었습니다.");
    }

    /**
     * 현재 로그인한 사용자의 비밀번호 변경
     *
     * @param userId 현재 로그인한 사용자의 ID
     * @param request 비밀번호 변경 요청 정보
     * @return 비밀번호 변경 성공 메시지
     */
    @PatchMapping("/me/password")
    public ResponseEntity<String> updatePassword(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody PasswordUpdateRequest request) {
        userService.updatePassword(userId, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
    }

    /**
     * 현재 로그인한 사용자의 이메일 변경
     *
     * @param userId 현재 로그인한 사용자의 ID
     * @param request 이메일 변경 요청 정보
     * @return 이메일 변경 성공 메시지
     */
    @PatchMapping("/me/email")
    public ResponseEntity<String> updateEmail(
            @AuthenticationPrincipal String userId,
            @RequestBody EmailUpdateRequest request) {
        userService.updateEmail(userId, request.getNewEmail());
        return ResponseEntity.ok("이메일이 성공적으로 변경되었습니다.");
    }

    /**
     * 현재 로그인한 사용자 탈퇴
     *
     * @param userId 탈퇴할 사용자 정보
     * @return 수정된 사용자 정보
     */
    @DeleteMapping("/me")
    public ResponseEntity<String> deleteSelf(@AuthenticationPrincipal String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("회원탈퇴가 정상적으로 처리되었습니다.");
    }



}
