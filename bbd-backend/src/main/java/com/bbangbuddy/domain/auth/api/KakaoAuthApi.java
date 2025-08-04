package com.bbangbuddy.domain.auth.api;

import com.bbangbuddy.domain.auth.dto.KakaoLoginRequest;
import com.bbangbuddy.domain.auth.dto.KakaoLoginResponse;
import com.bbangbuddy.domain.auth.service.KakaoAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

/**
 * @PackageName : com.bbangbuddy.domain.auth.kakao
 * @FileName : KakaoAuthApi
 * @Author : hjsim
 * @Date : 2025-06-09
 * @Description :  카카오 로그인 관련 API를 처리하는 컨트롤러
 */
@RestController
@RequestMapping("/api/auth/kakao")
@RequiredArgsConstructor
public class KakaoAuthApi {

    private final KakaoAuthService kakaoAuthService;

    /**
     * 카카오 로그인 요청을 처리하는 엔드포인트
     * @param request
     * @return 카카오 액세스 토큰과 JWT 토큰을 포함한 응답
     */
    @PostMapping
    public ResponseEntity<?> kakaoCallback(@Valid @RequestBody KakaoLoginRequest request) {
        KakaoLoginResponse response = kakaoAuthService.loginWithKakao(request.getToken());
        return ResponseEntity.ok(response);
    }

}
