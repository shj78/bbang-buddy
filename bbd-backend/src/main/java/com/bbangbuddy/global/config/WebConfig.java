package com.bbangbuddy.global.config;

/**
 * @PackageName : com.bbangbuddy.global.config
 * @FileName : WebConfig
 * @Author : hjsim
 * @Date : 2025-06-11
 * @Description : 웹 관련 설정 클래스
 */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://158.180.88.31:3000", "http://158.180.88.31")
                .allowedMethods("GET", "POST")
                .allowCredentials(true);
    }

    /**
     * WebClient 빈 등록
     * <p>
     * WebClient는 비동기 HTTP 요청을 처리하기 위한 클라이언트로, REST API 호출 등에 사용됩니다.
     * </p>
     *
     * @return WebClient 인스턴스
     */
    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .build();
    }

}
