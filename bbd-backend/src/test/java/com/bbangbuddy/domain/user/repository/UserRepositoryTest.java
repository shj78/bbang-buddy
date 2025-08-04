package com.bbangbuddy.domain.user.repository;

import com.bbangbuddy.domain.user.domain.Role;
import com.bbangbuddy.domain.user.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * UserRepository 데이터 접근 테스트
 * 
 * 테스트 목적: 사용자 데이터 접근 로직이 올바르게 동작하는지 검증
 * @DataJpaTest를 사용하여 JPA 관련 컴포넌트만 로드하고 실제 데이터베이스와 테스트
 */
@DataJpaTest
@ActiveProfiles("test")
@DisplayName("UserRepository 데이터 접근 테스트")
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    private Role testRole;
    private User jupiterUser;

    @BeforeEach
    void setUp() {
        // 기존 Role이 있다고 가정하거나 SQL로 직접 생성
        // 실제 프로젝트에서는 data.sql에 기본 Role들이 있을 것임
        Optional<Role> existingRole = roleRepository.findById(1L);
        if (existingRole.isPresent()) {
            testRole = existingRole.get();
        } else {
            // Role을 직접 SQL로 생성하는 대신 테스트를 스킵하거나 Mock 사용
            // 여기서는 Mock을 사용
            testRole = org.mockito.Mockito.mock(Role.class);
            org.mockito.Mockito.when(testRole.getId()).thenReturn(1L);
            org.mockito.Mockito.when(testRole.getName()).thenReturn("USER");
        }

        // 기존 Role이 없으면 직접 생성해서 저장
        if (existingRole.isPresent()) {
            testRole = existingRole.get();
        } else {
            testRole = Role.builder()
                    .name("USER")
                    .build();
            testRole = entityManager.persistAndFlush(testRole);
        }
        
        // User 생성 및 저장
        jupiterUser = User.builder()
                .userId("jupiterUser")
                .username("테스트유저")
                .email("jupiter@galuxy.com")
                .passwordHash("encodedPassword")
                .provider("local")
                .roleId(testRole)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        jupiterUser = entityManager.persistAndFlush(jupiterUser);
        
        entityManager.clear();
    }

    @Test
    @DisplayName("userId로 사용자 조회 테스트")
    void findByUserId_success() {
        // When
        Optional<User> foundUser = userRepository.findByUserId("jupiterUser");

        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUsername()).isEqualTo("테스트유저");
        assertThat(foundUser.get().getEmail()).isEqualTo("jupiter@galuxy.com");
        assertThat(foundUser.get().getRoleId().getName()).isEqualTo("USER");
    }

    @Test
    @DisplayName("userId로 사용자 조회 실패 - 존재하지 않는 사용자")
    void findByUserId_notFound() {
        // When
        Optional<User> foundUser = userRepository.findByUserId("nonExistentUser");

        // Then
        assertThat(foundUser).isEmpty();
    }

    @Test
    @DisplayName("이메일로 사용자 조회 테스트")
    void findByEmail_success() {
        // When
        Optional<User> foundUser = userRepository.findByEmail("jupiter@galuxy.com");

        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUserId()).isEqualTo("jupiterUser");
        assertThat(foundUser.get().getUsername()).isEqualTo("테스트유저");
    }

    @Test
    @DisplayName("이메일로 사용자 조회 실패 - 존재하지 않는 이메일")
    void findByEmail_notFound() {
        // When
        Optional<User> foundUser = userRepository.findByEmail("nonexistent@example.com");

        // Then
        assertThat(foundUser).isEmpty();
    }

    @Test
    @DisplayName("사용자 저장 테스트")
    void save_success() {
        // Given
        User newUser = User.builder()
                .userId("newUser")
                .username("새로운유저")
                .email("new@example.com")
                .passwordHash("newPassword")
                .provider("local")
                .roleId(testRole)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // When
        User savedUser = userRepository.save(newUser);

        // Then
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getUserId()).isEqualTo("newUser");
        assertThat(savedUser.getUsername()).isEqualTo("새로운유저");
        
        // 데이터베이스에서 실제로 저장되었는지 확인
        Optional<User> foundUser = userRepository.findByUserId("newUser");
        assertThat(foundUser).isPresent();
    }

    @Test
    @DisplayName("모든 사용자 조회 테스트")
    void findAll_success() {
        // Given - 추가 사용자 생성
        User additionalUser = User.builder()
                .userId("additionalUser")
                .username("추가유저")
                .email("additional@example.com")
                .passwordHash("password")
                .provider("local")
                .roleId(testRole)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        entityManager.persistAndFlush(additionalUser);

        // When
        List<User> allUsers = userRepository.findAll();

        // Then
        assertThat(allUsers).hasSize(2);
        assertThat(allUsers).extracting(User::getUserId)
                .contains("jupiterUser", "additionalUser");
    }

    @Test
    @DisplayName("사용자 삭제 테스트")
    void delete_success() {
        // Given
        Long userId = jupiterUser.getId();

        // When
        userRepository.deleteById(userId);

        // Then
        Optional<User> deletedUser = userRepository.findById(userId);
        assertThat(deletedUser).isEmpty();
        
        // userId로도 조회되지 않아야 함
        Optional<User> deletedUserByUserId = userRepository.findByUserId("jupiterUser");
        assertThat(deletedUserByUserId).isEmpty();
    }
} 