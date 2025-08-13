package com.bbangbuddy.domain.pot.repository;

import com.bbangbuddy.domain.pot.domain.PotParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * @PackageName : com.bbangbuddy.domain.pot.repository
 * @FileName : PotParticipantRepository
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 빵팟 참가자 데이터베이스 작업을 처리하는 레포지토리 인터페이스
 */
public interface PotParticipantRepository extends JpaRepository<PotParticipant, Long> {

    @Query("SELECT count(p) > 0 FROM PotParticipant p WHERE p.potId = :potId AND p.userId = :userId")
    boolean existsPotParticipant(@Param("potId") Long potId, @Param("userId") String userId);

    List<PotParticipant> findByPotIdAndUserId(Long potId, String userId);

    List<PotParticipant> findByPotId(Long potId);

    List<PotParticipant> findByUserId(String userId);

}