package com.bbangbuddy.domain.auth.api;

import com.bbangbuddy.domain.auth.dto.FirebaseAuthResult;
import com.bbangbuddy.domain.auth.dto.FirebaseLoginRequest;
import com.bbangbuddy.domain.auth.service.FirebaseAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.validation.Valid;

/**
 * @PackageName : com.bbangbuddy.domain.auth.api
 * @FileName : FirebaseAuthApi
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : Firebase ID 토큰을 이용한 인증 컨트롤러
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/firebase")
public class FirebaseAuthApi {

    private final FirebaseAuthService firebaseAuthService;

    /**
     * Firebase ID 토큰을 이용한 로그인 엔드포인트
     * @param request Firebase ID 토큰을 포함한 요청
     * @return JWT 토큰을 포함한 응답
     */
    @PostMapping("/google")
    public ResponseEntity<FirebaseAuthResult> loginWithFirebase(@Valid @RequestBody FirebaseLoginRequest request) {
        FirebaseAuthResult response = firebaseAuthService.loginWithFirebase(request.getIdToken());
        return ResponseEntity.ok(response);
    }

}