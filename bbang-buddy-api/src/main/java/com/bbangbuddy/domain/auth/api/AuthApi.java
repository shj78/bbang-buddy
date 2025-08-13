package com.bbangbuddy.domain.auth.api;

import com.bbangbuddy.domain.auth.dto.AuthResult;
import com.bbangbuddy.domain.auth.dto.LoginRequest;
import com.bbangbuddy.domain.auth.dto.SignUpRequest;
import com.bbangbuddy.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.validation.Valid;

/**
 * @PackageName : com.bbangbuddy.domain.auth.api
 * @FileName : AuthApi
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description :  로그인 및 회원가입을 처리하는 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthApi {

    private final AuthService authService;

    /**
     * 회원가입 요청을 처리하는 엔드포인트
     * @param signUpRequest 회원가입 요청 정보
     * @return 성공 시 200 OK 반환
     */
    @PostMapping("/signup")
    public ResponseEntity<Void> saveUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        authService.saveUser(signUpRequest);
        return ResponseEntity.ok().build();
    }

    /**
     * 로그인 요청을 처리하는 엔드포인트
     * @param loginRequest 로그인 요청 정보
     * @return 로그인 성공 시 accessToken(JWT)이 담긴 LoginResponse 반환
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResult> logIn(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.logIn(loginRequest));
    }

}