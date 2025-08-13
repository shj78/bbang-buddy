package com.bbangbuddy.domain.auth.service;

import com.bbangbuddy.domain.auth.dto.AuthResult;
import com.bbangbuddy.domain.auth.dto.LoginRequest;
import com.bbangbuddy.domain.auth.dto.SignUpRequest;
import com.bbangbuddy.domain.auth.jwt.JwtUtil;
import com.bbangbuddy.domain.user.domain.Role;
import com.bbangbuddy.domain.user.domain.User;
import com.bbangbuddy.domain.user.repository.RoleRepository;
import com.bbangbuddy.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

/**
 * AuthService 단위 테스트
 * 
 * 테스트 목적: AuthService의 각 메서드가 올바르게 동작하는지 검증
 * Mock을 사용하여 의존성을 격리
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService 단위 테스트")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private JwtUtil jwtUtil;
    
    @Mock
    private RoleRepository roleRepository;
    
    @InjectMocks
    private AuthService authService;
    
    private SignUpRequest signUpRequest;
    private LoginRequest loginRequest;
    private User testUser;
    private Role testRole;

    @BeforeEach
    void setUp() {
        // Role Mock 설정
        testRole = mock(Role.class);
        
        // SignUpRequest 설정
        signUpRequest = SignUpRequest.builder()
            .userId("jupiterUser")
            .username("목성유저")
            .email("jupiter@galuxy.com")
            .password("password123!")
            .roleId(1L)
            .provider("local")
            .build();
                
        // LoginRequest 설정
        loginRequest = LoginRequest.builder()
            .userId("jupiterUser")
            .password("password123!")
            .build();
        
        // User 설정
        testUser = User.builder()
            .id(1L)
            .userId("jupiterUser")
            .username("목성유저")
            .email("jupiter@galuxy.com")
            .passwordHash("encodedPassword123!")
            .provider("local")
            .roleId(testRole)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
    }

    @Test
    @DisplayName("회원가입 성공 테스트")
    void saveUser_success() {
        // Given
        given(roleRepository.findById(1L)).willReturn(Optional.of(testRole));
        given(passwordEncoder.encode("password123!")).willReturn("encodedPassword123!");
        given(userRepository.save(any(User.class))).willReturn(testUser);

        // When
        User result = authService.saveUser(signUpRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getUserId()).isEqualTo("jupiterUser");
        verify(roleRepository).findById(1L);
        verify(passwordEncoder).encode("password123!");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("회원가입 실패 - 존재하지 않는 역할")
    void saveUser_roleNotFound() {
        // Given
        given(roleRepository.findById(1L)).willReturn(Optional.empty());

        // When & Then
        // assertThatThrownBy로 예외 타입과 메시지를 검증
        assertThatThrownBy(() -> authService.saveUser(signUpRequest))
            .isInstanceOf(RuntimeException.class)
            .hasMessage("기본 역할이 존재하지 않습니다. ID: 1");
        //verify로 Mock 객체의 메서드 호출 여부 확인
        verify(roleRepository).findById(1L);
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("로그인 성공 테스트")
    void login_success() {
        // Given
        given(userRepository.findByUserId("jupiterUser")).willReturn(Optional.of(testUser));
        given(passwordEncoder.matches("password123!", "encodedPassword123!")).willReturn(true);
        given(jwtUtil.createToken("jupiterUser")).willReturn("jwt.test.token");

        // When
        AuthResult result = authService.logIn(loginRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getJwtToken()).isEqualTo("jwt.test.token");
        verify(userRepository).findByUserId("jupiterUser");
        verify(passwordEncoder).matches("password123!", "encodedPassword123!");
        verify(jwtUtil).createToken("jupiterUser");
    }

    @Test
    @DisplayName("로그인 실패 - 존재하지 않는 사용자")
    void login_userNotFound() {
        // Given
        given(userRepository.findByUserId("jupiterUser")).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> authService.logIn(loginRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("존재하지 않는 사용자입니다.");
        
        verify(userRepository).findByUserId("jupiterUser");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).createToken(anyString());
    }

    @Test
    @DisplayName("로그인 실패 - 잘못된 비밀번호")
    void login_wrongPassword() {
        // Given
        given(userRepository.findByUserId("jupiterUser")).willReturn(Optional.of(testUser));
        given(passwordEncoder.matches("password123!", "encodedPassword123!")).willReturn(false);

        // When & Then
        assertThatThrownBy(() -> authService.logIn(loginRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("비밀번호가 일치하지 않습니다.");
        
        verify(userRepository).findByUserId("jupiterUser");
        verify(passwordEncoder).matches("password123!", "encodedPassword123!");
        verify(jwtUtil, never()).createToken(anyString());
    }

    @Test
    @DisplayName("로그인 실패 - 소셜 로그인 사용자")
    void login_socialUser() {
        // Given
        User socialUser = User.builder()
                .id(testUser.getId())
                .userId(testUser.getUserId())
                .username(testUser.getUsername())
                .email(testUser.getEmail())
                .passwordHash(null) // 소셜 로그인은 패스워드 없음
                .provider("kakao")
                .roleId(testUser.getRoleId())
                .createdAt(testUser.getCreatedAt())
                .updatedAt(testUser.getUpdatedAt())
                .build();
        given(userRepository.findByUserId("jupiterUser")).willReturn(Optional.of(socialUser));

        // When & Then
        assertThatThrownBy(() -> authService.logIn(loginRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("소셜 로그인 사용자입니다.");
        
        verify(userRepository).findByUserId("jupiterUser");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).createToken(anyString());
    }
} 