package com.bbangbuddy.domain.auth.service;

import com.bbangbuddy.domain.auth.dto.AuthResult;
import com.bbangbuddy.domain.auth.dto.LoginRequest;
import com.bbangbuddy.domain.auth.dto.LoginResponse;
import com.bbangbuddy.domain.auth.dto.SignUpRequest;
import com.bbangbuddy.domain.auth.jwt.JwtUtil;
import com.bbangbuddy.domain.user.domain.Role;
import com.bbangbuddy.domain.user.domain.User;
import com.bbangbuddy.domain.user.repository.UserRepository;
import com.bbangbuddy.domain.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * @PackageName : com.bbangbuddy.domain.auth.service
 * @FileName : AuthService
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 스프링 시큐리티를 이용한 인증 및 회원가입 서비스
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RoleRepository roleRepository;

    /**
     * 로그인 요청을 처리하는 메서드
     * @param request 로그인 요청 정보
     * @return 로그인 성공 시 JWT 토큰을 포함한 LoginResponse 객체
     */
    public AuthResult logIn(LoginRequest request) {
        return userRepository.findByUserId(request.getUserId())
            .map(user -> {
                if (!"local".equals(user.getProvider()) || user.getPasswordHash() == null) {
                    throw new RuntimeException("소셜 로그인 사용자입니다.");
                }

                if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                    throw new RuntimeException("비밀번호가 일치하지 않습니다.");
                }
                // BBANG BUDDY용 JWT 토큰 생성
                String token = jwtUtil.createToken(user.getUserId());

                User.UserBuilder userBuilder = User.builder()
                        .userId(user.getUserId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .uid(user.getUid())
                        .roleId(user.getRoleId())
                        .provider(user.getProvider())
                        .createdAt(user.getCreatedAt());

                return AuthResult.builder()
                        .user(userBuilder.build())
                        .jwtToken(token)
                        .build();
            })
            .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));


    }

    /**
     * 회원가입 요청을 처리하는 메서드
     * @param signUpRequest 회원가입 요청 정보
     */
    public User saveUser(SignUpRequest signUpRequest) {
        if (signUpRequest.getId() == null) {
            Long roleId = signUpRequest.getRoleId();
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("기본 역할이 존재하지 않습니다. ID: " + roleId));

            User.UserBuilder userBuilder = User.builder()
                .userId(signUpRequest.getUserId())
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .uid(signUpRequest.getUid())
                .roleId(role)
                .provider(signUpRequest.getProvider());

            if ("local".equals(signUpRequest.getProvider())) {
                userBuilder.passwordHash(passwordEncoder.encode(signUpRequest.getPassword()));
            }

            return userRepository.save(userBuilder.build());
        } else {
            throw new IllegalArgumentException("새로운 사용자 생성만 가능합니다.");
        }
    }

}
