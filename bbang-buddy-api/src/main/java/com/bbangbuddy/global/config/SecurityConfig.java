package com.bbangbuddy.global.config;

import com.bbangbuddy.domain.auth.jwt.JwtAuthenticationFilter;
import com.bbangbuddy.domain.auth.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

/**
 * @PackageName : com.bbangbuddy.domain.config
 * @FileName : SecurityConfig
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : Spring Security를 커스터마이징하기 위한 클래스, 인증, 인가 정책 및 JWT 필터 등록
 */

@Configuration // Spring Security 커스터마이징 하고자 하는 것과  설정 클래스를 나타내는 어노테이션
@EnableWebSecurity //Spring Security 커스터마이징 선언
@RequiredArgsConstructor //이건 앤간한 Spring Security 설정 클래스에 붙이는게 좋다. 이걸 붙이면 생성자 주입을 통해 필요한 의존성을 주입받을 수 있다.
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    //보안 필터 체인 정의: 경로별 인증/인가 정책 설정 - 필수 등록 빈
    //보안 가방에 키링 달기
    //인자인 httpSecurity는 Spring Security 내부에서 자동으로 생성해서 메서드에 주입시키는 것
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtUtil);

        httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 추가
                .csrf(csrf -> csrf.disable())
                // CSRF 보호 비활성화: REST API에서는 CSRF 공격이 발생하지 않도록 하기 위해 비활성화 ?
                .headers().frameOptions().disable()
                .and()
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .antMatchers("/api/auth/**", "/api/pot/near", "/api/pot", "/api/pot/search","/h2-console/**").permitAll()//허용하고자 하는 url SecurityConfig 내 permitAll추가 및 shouldNotFilter 설정 할 것
                        .requestMatchers(new AntPathRequestMatcher("/api/user/**", "DELETE")).authenticated()
                        .anyRequest().authenticated()
                )
                // 모든 요청 전에 실행됨. 요청 헤더에서 Bearer 토큰을 추출함. 토큰 검증하고, 유효하면 인증 정보를 SecurityContext에 등록함.
                //그러면 필터들이 SecurityContextHolder.getContext().getAuthentication() 으로 인증상태를 알 수 있음
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"
                ,"http://158.180.88.31:3000"
                , "http://158.180.88.31"
                , "http://bbangbuddy.com"
                ,"https://158.180.88.31:3000"
                , "https://158.180.88.31"
                , "https://bbangbuddy.com"
        )); // 허용할 출처 설정
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // 비밀번호 암호화를 위한 PasswordEncoder 빈 등록
    }

}
