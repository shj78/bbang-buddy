package com.bbangbuddy.domain.pot.repository;

import com.bbangbuddy.domain.pot.domain.QPot;
import com.bbangbuddy.domain.pot.dto.PotDto;
import com.bbangbuddy.global.util.ConditionFactory;
import com.bbangbuddy.global.util.QueryUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * @PackageName : com.bbangbuddy.domain.pot.repository
 * @FileName : PotRepositorySupport
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 빵팟 데이터베이스 작업을 처리하는 레포지토리 지원 클래스
 */
@Repository
@RequiredArgsConstructor
public class PotRepositorySupport {

    private final JPAQueryFactory queryFactory;
    private final QPot pot = QPot.pot;

    public List<PotDto.Response> findBySearchCondition(PotDto.Search search){
        return queryFactory.select(Projections.fields(
            PotDto.Response.class,
            pot.id,
            pot.description,
            pot.title,
            pot.latitude,
            pot.longitude,
            pot.maxParticipants,
            pot.currentParticipants,
            pot.imagePath,
            pot.originalFileName,
            pot.dueDate,
            pot.chatRoomUrl,
            pot.createdBy,
            pot.createdAt,
            pot.updatedAt,
            pot.address
        ))
        .from(pot)
        .where(ConditionFactory.of(pot, search).getPredicateArray())
        .orderBy(QueryUtils.getSortedColumnList("-dueDate", pot))
        .fetch();
    }

}