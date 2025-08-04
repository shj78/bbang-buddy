package com.bbangbuddy.domain.auth.jwt;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.ResponseEntity;

import java.security.Key;
import java.util.Date;

/**
 * @PackageName : com.bbangbuddy.domain.auth.jwt
 * @FileName : JwtUtil
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description :  JWT 토큰 생성/검증, 사용자 정보 추출 유틸
 */
@Component
@Slf4j
public class JwtUtil {

    private final Key key;
    private final FirebaseAuth firebaseAuth;

    public JwtUtil(@Value("${jwt.secret}") String secretKey, FirebaseAuth firebaseAuth) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
        this.firebaseAuth = firebaseAuth;
    }

    private Jws<Claims> parseToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
        } catch (JwtException e) {
            log.error("토큰 파싱 실패: {}", e.getMessage());
            throw e;
        }
    }

    public String getUserIdFromToken(String token) {
        if (token == null) {
            throw new IllegalArgumentException("토큰이 null입니다.");
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
            try {
                return parseToken(token).getBody().getSubject();
            } catch (JwtException e) {
                log.error("JWT 토큰 파싱 실패: {}", e.getMessage(), e);
                throw new IllegalArgumentException("유효하지 않은 JWT 토큰입니다: " + e.getMessage());
            }
        } else if (token.startsWith("Firebase ")) {
            String firebaseToken = token.substring(9);
            try {
                return firebaseAuth.verifyIdToken(firebaseToken).getUid();
            } catch (FirebaseAuthException e) {
                log.error("Firebase 토큰 검증 실패: {}", e.getMessage());
                throw new IllegalArgumentException("유효하지 않은 Firebase 토큰입니다");
            }
        }

        throw new IllegalArgumentException("지원하지 않는 토큰 형식입니다");
    }

    public String createToken(String userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + 86400000); // 24시간

        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

}