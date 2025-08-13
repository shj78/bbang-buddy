package com.bbangbuddy.domain.pot.repository;

import com.bbangbuddy.domain.pot.domain.Pot;
import com.bbangbuddy.domain.pot.dto.PotProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @PackageName : com.bbangbuddy.domain.pot.repository
 * @FileName : PotRepository
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 빵팟 데이터베이스 작업을 처리하는 레포지토리 인터페이스
 */
public interface PotRepository extends JpaRepository<Pot, Long> {

    // 모든 팟 조회 (기본 제공)
    List<Pot> findAll();

    // 특정 팟 참가자 업데이트
    /*
    * 동시성 문제: 여러 사용자가 동시에 참가/탈퇴할 경우 경쟁 상태(race condition)가 발생할 수 있습니다.
    * 제약 조건 부재: 참가자 수가 음수가 되거나 최대 참가자 수를 초과하는 검증이 없습니다.
    @Modifying
    @Transactional
    @Query("UPDATE Pot p SET p.currentParticipants = (p.currentParticipants+:count) WHERE p.id = :potId")
    void updateCurrentParticipants(@Param("potId") Long potId, @Param("count") int count);
    * */
    @Modifying
    @Transactional
    @Query(value = "UPDATE Pot p SET p.currentParticipants = " +
            "CASE WHEN (p.currentParticipants + :count) >= 0 AND " +
            "(p.currentParticipants + :count) <= p.maxParticipants " +
            "THEN (p.currentParticipants + :count) " +
            "ELSE p.currentParticipants END " +
            "WHERE p.id = :potId")
    int updateCurrentParticipants(@Param("potId") Long potId, @Param("count") int count);

    @Query(value =
            "SELECT " +
                    "p.id AS id, " +
                    "p.title AS title, " +
                    "CAST(p.description AS VARCHAR) AS description, " +
                    "p.latitude AS latitude, " +
                    "p.longitude AS longitude, " +
                    "p.max_participants AS maxParticipants, " +
                    "p.current_participants AS currentParticipants, " +
                    "p.due_date AS dueDate, " +
                    "p.image_path AS imagePath, " +
                    "p.original_file_name AS originalFileName, " +
                    "p.address AS address, " +
                    "p.created_by AS createdBy, " +
                    "p.created_at AS createdAt, " +
                    "p.updated_at AS updatedAt " +
                    "FROM BBANGPOT p " +
                    "WHERE (6371 * ACOS(COS(RADIANS(:latitude)) * COS(RADIANS(p.latitude)) * " +
                    "COS(RADIANS(p.longitude) - RADIANS(:longitude)) + " +
                    "SIN(RADIANS(:latitude)) * SIN(RADIANS(p.latitude)))) <= :distance",
            nativeQuery = true)
    List<PotProjection> findNearbyPots(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("distance") int distance
    );
    // 오라클 공간 함수 SDO_WITHIN_DISTANCE를 사용하여 특정 위치에서 지정된 거리 내에 있는 팟을 조회하는 메소드

//    @Query(value =
//            "SELECT " +
//                    "    p.id AS \"id\", " +
//                    "    p.title AS \"title\", " +
//                    "    TO_CHAR(p.description) AS \"description\", " +
//                    "    p.latitude AS \"latitude\", " +
//                    "    p.longitude AS \"longitude\", " +
//                    "    p.max_participants AS \"maxParticipants\", " +
//                    "    p.current_participants AS \"currentParticipants\", " +
//                    "    p.due_date AS \"dueDate\", " +
//                    "    p.image_path AS \"imagePath\", " +
//                    "    p.original_file_name AS \"originalFileName\", " +
//                    "    p.created_by AS \"createdBy\", " +
//                    "    p.created_at AS \"createdAt\", " +
//                    "    p.updated_at AS \"updatedAt\" "+
//                    "FROM BBANGPOT p " +
//                    "WHERE SDO_WITHIN_DISTANCE( " +
//                    "SDO_GEOMETRY(2001, 4326, SDO_POINT_TYPE(p.longitude, p.latitude, NULL), NULL, NULL), " +
//                    "SDO_GEOMETRY(2001, 4326, SDO_POINT_TYPE(:longitude, :latitude, NULL), NULL, NULL), " +
//                    "'distance=' || :distance || ' unit=kilometer') = 'TRUE'",
//            nativeQuery = true)
//    List<PotProjection> findNearbyPots( //TODO: PotProjection > PotDto.Response로 변경 필요
//            @Param("latitude") double latitude,
//            @Param("longitude") double longitude,
//            @Param("distance") int distance
//    );



}