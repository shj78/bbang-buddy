package com.bbangbuddy.domain.user.service;

import com.bbangbuddy.domain.user.domain.User;
import com.bbangbuddy.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * @PackageName : com.bbangbuddy.domain.user.service
 * @FileName : UserService
 * @Author : hjsim
 * @Date : 2025-06-04
 * @Description :  사용자 관련 서비스
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 모든 사용자 조회
     *
     * @return 전체 사용자 목록
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * ID로 사용자 조회
     *
     * @param id 조회할 사용자의 고유 식별자
     * @return 해당 ID의 사용자 정보 (Optional)
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * userId로 사용자 조회
     *
     * @param userId 조회할 사용자의 아이디
     * @return 해당 userId를 가진 사용자 정보 (Optional)
     */
    public Optional<User> getUserByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }

    /**
     * 현재 로그인한 사용자 패스워드 변경
     *
     * @param userId 현재 로그인한 사용자의 아이디
     * @param currentPassword 현재 비밀번호
     * @param newPassword 새 비밀번호
     * @return void
     */
    @Transactional
    public void updatePassword(String userId, String currentPassword, String newPassword) {
        User user = getUserByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        if(!passwordEncoder.matches(currentPassword,user.getPasswordHash())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * 현재 로그인한 사용자 이메일 변경
     *
     * @param userId 현재 로그인한 사용자의 아이디
     * @param newEmail 새 이메일
     * @return void
     */
    @Transactional
    public void updateEmail(String userId, String newEmail) {
        User user = getUserByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        user.setEmail(newEmail);
        userRepository.save(user);
    }

    /**
     * 사용자 삭제
     *
     * @param userId 삭제할 사용자의 아이디
     * @throws IllegalArgumentException 해당 userId를 가진 사용자가 없는 경우
     */
    @Transactional
    public void deleteUser(String userId) {
        User user = getUserByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        userRepository.delete(user);
    }
}