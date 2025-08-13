package com.bbangbuddy.global.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
/**
 * @PackageName : com.bbangbuddy.global.config
 * @FileName : QuerydslConfig
 * @Author : hjsim
 * @Date : 2025-06-10
 * @Description : Querydsl을 사용하기 위한 설정 클래스
 */

@Configuration
public class QuerydslConfig {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }

}