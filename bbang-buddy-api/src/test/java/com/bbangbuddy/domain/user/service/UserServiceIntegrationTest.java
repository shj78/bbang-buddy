package com.bbangbuddy.domain.user.service;

import com.bbangbuddy.domain.user.domain.Role;
import com.bbangbuddy.domain.user.domain.User;
import com.bbangbuddy.domain.user.repository.RoleRepository;
import com.bbangbuddy.domain.user.repository.UserRepository;
import com.bbangbuddy.global.config.FirebaseConfig;
import com.bbangbuddy.global.config.TestFirebaseConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * UserService 통합 테스트
 * 
 * 테스트 목적: UserService가 실제 Spring 컨텍스트와 데이터베이스와 함께 올바르게 동작하는지 검증
 * 실제 Bean들을 사용하여 전체적인 플로우를 테스트
 */
@Disabled("Firebase 등 외부 의존성 문제로 임시 비활성화. 환경 정비 후 활성화 예정")
@Import(TestFirebaseConfig.class)
@SpringBootTest // Spring Boot 전체 컨텍스트를 로드
@ActiveProfiles("test") // 테스트 프로파일 사용
@Transactional // 각 테스트 후 롤백
@DisplayName("UserService 통합 테스트")
class UserServiceIntegrationTest {

    @Autowired
    private UserService userService; // 실제 Bean 주입
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private Role testRole;
    private User testUser;

    @BeforeEach
    void setUp() {
        // 테스트 데이터 정리
        userRepository.deleteAll();
        roleRepository.deleteAll();
        
        // Role 생성 및 저장 (ReflectionTestUtils 사용)
        testRole = ReflectionTestUtils.invokeMethod(Role.class, "new");
        if (testRole == null) {
            // Role의 protected 생성자를 직접 호출할 수 없으므로 다른 방법 시도
            try {
                java.lang.reflect.Constructor<Role> constructor = Role.class.getDeclaredConstructor();
                constructor.setAccessible(true);
                testRole = constructor.newInstance();
            } catch (Exception e) {
                throw new RuntimeException("Role 객체 생성 실패", e);
            }
        }
        
        // ReflectionTestUtils를 사용하여 필드 설정
        ReflectionTestUtils.setField(testRole, "name", "USER");
        ReflectionTestUtils.setField(testRole, "description", "일반 사용자");
        testRole = roleRepository.save(testRole);
        
        // User 생성 및 저장
        testUser = User.builder()
                .userId("integrationTestUser")
                .username("통합테스트유저")
                .email("integration@test.com")
                .passwordHash(passwordEncoder.encode("password123!"))
                .provider("local")
                .roleId(testRole)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        testUser = userRepository.save(testUser);
    }

    @Test
    @DisplayName("실제 데이터베이스에서 모든 사용자 조회")
    void getAllUsers_withRealDatabase() {
        // When
        List<User> users = userService.getAllUsers();

        // Then
        assertThat(users).hasSize(1);
        assertThat(users.get(0).getUserId()).isEqualTo("integrationTestUser");
        assertThat(users.get(0).getEmail()).isEqualTo("integration@test.com");
    }

    @Test
    @DisplayName("실제 데이터베이스에서 ID로 사용자 조회")
    void getUserById_withRealDatabase() {
        // When
        Optional<User> foundUser = userService.getUserById(testUser.getId());

        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUserId()).isEqualTo("integrationTestUser");
        assertThat(foundUser.get().getRoleId().getId()).isEqualTo(testRole.getId());
    }

    @Test
    @DisplayName("실제 데이터베이스에서 userId로 사용자 조회")
    void getUserByUserId_withRealDatabase() {
        // When
        Optional<User> foundUser = userService.getUserByUserId("integrationTestUser");

        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo("integration@test.com");
        assertThat(foundUser.get().getProvider()).isEqualTo("local");
    }

    @Test
    @DisplayName("실제 패스워드 인코더를 사용한 패스워드 변경 테스트")
    void updatePassword_withRealPasswordEncoder() {
        // Given
        String currentPassword = "password123!";
        String newPassword = "newPassword456!";

        // When
        userService.updatePassword("integrationTestUser", currentPassword, newPassword);

        // Then
        User updatedUser = userRepository.findByUserId("integrationTestUser")
                .orElseThrow(() -> new AssertionError("사용자를 찾을 수 없습니다"));
        boolean isNewPasswordMatch = passwordEncoder.matches(newPassword, updatedUser.getPasswordHash());
        assertThat(isNewPasswordMatch).isTrue();
        
        // 이전 패스워드로는 매치되지 않아야 함
        boolean isOldPasswordMatch = passwordEncoder.matches(currentPassword, updatedUser.getPasswordHash());
        assertThat(isOldPasswordMatch).isFalse();
    }

    @Test
    @DisplayName("잘못된 현재 패스워드로 패스워드 변경 시도")
    void updatePassword_wrongCurrentPassword_shouldThrowException() {
        // Given
        String wrongCurrentPassword = "wrongPassword";
        String newPassword = "newPassword456";

        // When & Then
        assertThatThrownBy(() -> userService.updatePassword("integrationTestUser", wrongCurrentPassword, newPassword))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("현재 비밀번호가 일치하지 않습니다.");

        // 패스워드가 변경되지 않았는지 확인
        User unchangedUser = userRepository.findByUserId("integrationTestUser")
                .orElseThrow(() -> new AssertionError("사용자를 찾을 수 없습니다"));
        boolean isOriginalPasswordMatch = passwordEncoder.matches("password123!", unchangedUser.getPasswordHash());
        assertThat(isOriginalPasswordMatch).isTrue();
    }

    @Test
    @DisplayName("실제 데이터베이스에서 이메일 변경 테스트")
    void updateEmail_withRealDatabase() {
        // Given
        String newEmail = "updated@example.com";

        // When
        userService.updateEmail("integrationTestUser", newEmail);

        // Then
        User updatedUser = userRepository.findByUserId("integrationTestUser")
                .orElseThrow(() -> new AssertionError("사용자를 찾을 수 없습니다"));
        assertThat(updatedUser.getEmail()).isEqualTo(newEmail);
        
        // updatedAt이 변경되었는지 확인
        assertThat(updatedUser.getUpdatedAt()).isAfter(updatedUser.getCreatedAt());
    }

    @Test
    @DisplayName("실제 데이터베이스에서 사용자 삭제 테스트")
    void deleteUser_withRealDatabase() {
        // Given
        String userIdToDelete = "integrationTestUser";
        
        // 삭제 전 사용자가 존재하는지 확인
        assertThat(userRepository.findByUserId(userIdToDelete)).isPresent();

        // When
        userService.deleteUser(userIdToDelete);

        // Then
        Optional<User> deletedUser = userRepository.findByUserId(userIdToDelete);
        assertThat(deletedUser).isEmpty();
        
        // 전체 사용자 수도 확인
        List<User> allUsers = userRepository.findAll();
        assertThat(allUsers).isEmpty();
    }

    @Test
    @DisplayName("존재하지 않는 사용자 조회")
    void getUserByUserId_nonExistentUser() {
        // When
        Optional<User> result = userService.getUserByUserId("nonExistentUser");

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("존재하지 않는 사용자 삭제 시도")
    void deleteUser_nonExistentUser_shouldThrowException() {
        // When & Then
        assertThatThrownBy(() -> userService.deleteUser("nonExistentUser"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("사용자를 찾을 수 없습니다.");
    }
} 