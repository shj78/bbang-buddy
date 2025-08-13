package com.bbangbuddy.domain.user.repository;

import com.bbangbuddy.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * @PackageName : com.bbangbuddy.domain.user.repository
 * @FileName : UserRepository
 * @Author : hjsim
 * @Date : 2025-06-04
 * @Description : 사용자 관련 레포지토리
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserId(String userId);

    Optional<User> findByEmail(String email); //카카오 로그인 시 이메일로 사용자 조회

    Optional<User> findByUid(String uid);
}
