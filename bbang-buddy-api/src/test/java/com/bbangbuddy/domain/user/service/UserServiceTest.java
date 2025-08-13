package com.bbangbuddy.domain.user.service;

import com.bbangbuddy.domain.user.domain.Role;
import com.bbangbuddy.domain.user.domain.User;
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
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

/**
 * UserService 단위 테스트
 * 
 * 테스트 목적: UserService의 각 메서드가 올바르게 동작하는지 검증
 * Mock을 사용하여 의존성(UserRepository, PasswordEncoder)을 격리
 */
@ExtendWith(MockitoExtension.class) // Mockito를 사용하기 위한 어노테이션
@DisplayName("UserService 단위 테스트")
class UserServiceTest {

    @Mock
    private UserRepository userRepository; // Mock 객체 생성
    
    @Mock
    private PasswordEncoder passwordEncoder; // Mock 객체 생성
    
    @Mock
    private Role testRole; // Role도 Mock으로 처리
    
    @InjectMocks
    private UserService userService; // 위의 Mock들을 주입받는 실제 테스트 대상
    
    private User testUser;

    @BeforeEach // 각 테스트 실행 전에 호출되는 메서드
    void setUp() {
        // 테스트용 User 객체 생성
        testUser = User.builder()
                .id(1L)
                .userId("testUser")
                .username("테스트유저")
                .email("test@example.com")
                .passwordHash("encodedPassword")
                .provider("local")
                .roleId(testRole)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("모든 사용자 조회 테스트")
    void getAllUsers_success() {
        // Given (테스트 조건 설정)
        List<User> expectedUsers = Arrays.asList(testUser);
        given(userRepository.findAll()).willReturn(expectedUsers);

        // When (테스트 실행)
        List<User> actualUsers = userService.getAllUsers();

        // Then (결과 검증)
        assertThat(actualUsers).hasSize(1);
        assertThat(actualUsers.get(0).getUserId()).isEqualTo("testUser");
        verify(userRepository, times(1)).findAll(); // 메서드가 1번 호출되었는지 확인
    }

    @Test
    @DisplayName("ID로 사용자 조회 성공 테스트")
    void getUserById_success() {
        // Given
        Long userId = 1L;
        given(userRepository.findById(userId)).willReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.getUserById(userId);

        // Then
        assertThat(result).isPresent(); // Optional에 값이 있는지 확인
        assertThat(result.get().getUserId()).isEqualTo("testUser");
        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("존재하지 않는 ID로 사용자 조회 테스트")
    void getUserById_notFound() {
        // Given
        Long nonExistentId = 999L;
        given(userRepository.findById(nonExistentId)).willReturn(Optional.empty());

        // When
        Optional<User> result = userService.getUserById(nonExistentId);

        // Then
        assertThat(result).isEmpty(); // Optional이 비어있는지 확인
    }

    @Test
    @DisplayName("userId로 사용자 조회 성공 테스트")
    void getUserByUserId_success() {
        // Given
        String userId = "testUser";
        given(userRepository.findByUserId(userId)).willReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.getUserByUserId(userId);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("패스워드 변경 성공 테스트")
    void updatePassword_success() {
        // Given
        String userId = "testUser";
        String currentPassword = "oldPassword";
        String newPassword = "newPassword";
        String encodedNewPassword = "encodedNewPassword";
        
        given(userRepository.findByUserId(userId)).willReturn(Optional.of(testUser));
        given(passwordEncoder.matches(currentPassword, testUser.getPasswordHash())).willReturn(true);
        given(passwordEncoder.encode(newPassword)).willReturn(encodedNewPassword);
        given(userRepository.save(any(User.class))).willReturn(testUser);

        // When
        userService.updatePassword(userId, currentPassword, newPassword);

        // Then
        verify(passwordEncoder).matches(currentPassword, "encodedPassword"); // testUser의 초기 passwordHash
        verify(passwordEncoder).encode(newPassword);
        verify(userRepository).save(testUser);
        assertThat(testUser.getPasswordHash()).isEqualTo(encodedNewPassword);
    }

    @Test
    @DisplayName("패스워드 변경 실패 - 잘못된 현재 패스워드")
    void updatePassword_wrongCurrentPassword() {
        // Given
        String userId = "testUser";
        String wrongCurrentPassword = "wrongPassword";
        String newPassword = "newPassword";
        
        given(userRepository.findByUserId(userId)).willReturn(Optional.of(testUser));
        given(passwordEncoder.matches(wrongCurrentPassword, testUser.getPasswordHash())).willReturn(false);

        // When & Then
        assertThatThrownBy(() -> userService.updatePassword(userId, wrongCurrentPassword, newPassword))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("현재 비밀번호가 일치하지 않습니다.");
        
        verify(userRepository, never()).save(any()); // save가 호출되지 않았는지 확인
    }

    @Test
    @DisplayName("패스워드 변경 실패 - 존재하지 않는 사용자")
    void updatePassword_userNotFound() {
        // Given
        String nonExistentUserId = "nonExistent";
        given(userRepository.findByUserId(nonExistentUserId)).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.updatePassword(nonExistentUserId, "password", "newPassword"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("사용자를 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("이메일 변경 성공 테스트")
    void updateEmail_success() {
        // Given
        String userId = "testUser";
        String newEmail = "newemail@example.com";
        
        given(userRepository.findByUserId(userId)).willReturn(Optional.of(testUser));
        given(userRepository.save(any(User.class))).willReturn(testUser);

        // When
        userService.updateEmail(userId, newEmail);

        // Then
        verify(userRepository).save(testUser);
        assertThat(testUser.getEmail()).isEqualTo(newEmail);
    }

    @Test
    @DisplayName("사용자 삭제 성공 테스트")
    void deleteUser_success() {
        // Given
        String userId = "testUser";
        given(userRepository.findByUserId(userId)).willReturn(Optional.of(testUser));

        // When
        userService.deleteUser(userId);

        // Then
        verify(userRepository).delete(testUser);
    }

    @Test
    @DisplayName("사용자 삭제 실패 - 존재하지 않는 사용자")
    void deleteUser_userNotFound() {
        // Given
        String nonExistentUserId = "nonExistent";
        given(userRepository.findByUserId(nonExistentUserId)).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.deleteUser(nonExistentUserId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("사용자를 찾을 수 없습니다.");
        
        verify(userRepository, never()).delete(any()); // delete가 호출되지 않았는지 확인
    }
} 