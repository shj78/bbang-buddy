package com.bbangbuddy.domain.user.repository;

import com.bbangbuddy.domain.user.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * @PackageName : com.bbangbuddy.domain.user.repository
 * @FileName : RoleRepository
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 권한 관련 데이터베이스 작업을 처리하는 레포지토리
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findById(Long id);

}