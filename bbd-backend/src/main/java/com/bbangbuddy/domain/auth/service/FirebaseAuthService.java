package com.bbangbuddy.domain.auth.service;

import com.bbangbuddy.domain.auth.dto.FirebaseAuthResult;
import com.bbangbuddy.domain.auth.dto.SignUpRequest;
import com.bbangbuddy.domain.auth.firebase.FirebaseTokenProvider;
import com.bbangbuddy.domain.auth.jwt.JwtUtil;
import com.bbangbuddy.domain.user.domain.User;
import com.bbangbuddy.domain.user.repository.RoleRepository;
import com.bbangbuddy.domain.user.repository.UserRepository;
import com.bbangbuddy.domain.user.service.UserService;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.Optional;

/**
 * @PackageName : com.bbangbuddy.domain.auth.service
 * @FileName : FirebaseAuthService
 * @Author : hjsim
 * @Date : 2025-06-23
 * @Description : 파이어베이스 ID 토큰을 이용한 인증 서비스
 */
@Service
@RequiredArgsConstructor
public class FirebaseAuthService {

    private final UserService userService;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final FirebaseTokenProvider tokenProvider;
    private final JwtUtil jwtUtil;

    public FirebaseAuthResult loginWithFirebase(String idToken) {
        if (idToken == null || idToken.isEmpty()) {
            throw new IllegalArgumentException("Firebase ID 토큰이 필요합니다.");
        }

        FirebaseToken userInfo = tokenProvider.verifyIdToken(idToken);

        if( userInfo == null || userInfo.getUid() == null) {
            throw new BadCredentialsException("❌ 유효하지 않은 Firebase 토큰입니다.");
        }

        Optional<User> userOpt = userRepository.findByUid(userInfo.getUid());

        User user = userOpt.orElseGet(() -> {
            return createNewUser(userInfo.getUid().toString(), userInfo.getEmail(), userInfo.getClaims().get("name").toString());
        });

        return FirebaseAuthResult.builder()
                .user(user)
                .jwtToken(jwtUtil.createToken(userInfo.getUid()))
                .build();
    }


    private User createNewUser(String uid, String email, String nickname) {
        SignUpRequest signUpRequest = SignUpRequest.builder()
                .userId("firebase_" + uid)
                .username(nickname)
                .email(email)
                .password("oauth")
                .roleId(1L)
                .uid(uid)
                .provider("google")
                .build();
        return authService.saveUser(signUpRequest);
    }
}
