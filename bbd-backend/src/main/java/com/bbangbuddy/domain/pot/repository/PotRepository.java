package com.bbangbuddy.domain.pot.repository;

import com.bbangbuddy.domain.pot.domain.Pot;
import com.bbangbuddy.domain.pot.dto.PotProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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