package com.bbangbuddy.domain.auth.jwt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @PackageName : com.bbangbuddy.domain.auth.jwt
 * @FileName : JwtAuthenticationFilter
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description :  JWT 토큰을 요청에서 추출하고, 검증하고, 인증 정보를 SecurityContext에 등록
 */
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    /**
     * JWT 토큰 기반 인증을 처리하는 필터 메서드
     *
     * @param request HTTP 요청 객체
     * @param response HTTP 응답 객체
     * @param filterChain 필터 체인
     * @throws ServletException 서블릿 처리 중 오류 발생 시
     * @throws IOException 입출력 처리 중 오류 발생 시
     */
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Authorization 요청 헤더에서 JWT Bearer 토큰을 추출
        String token = resolveToken(request);

        //유효한 경우
        if (StringUtils.hasText(token)) {
            String userId = jwtUtil.getUserIdFromToken(token);

            //Spring Security 인증 객체 생성
            UsernamePasswordAuthenticationToken authentication =

                    //userId가 Authentication 객체의 principal로 사용되며, 비밀번호는 null로 설정
                    new UsernamePasswordAuthenticationToken(userId, null, null);

            // 클라이언트의 IP 주소와 HTTP 세션 ID를 포함한 정보를 인증객체에 셋팅
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // SecurityContextHolder에 인증 정보 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);
            request.setAttribute("userId", userId);
            log.info("JWT 인증 성공: {}", authentication.getName());
        } else {
            log.warn("JWT 인증 실패: 유효하지 않은 토큰");
        }

        filterChain.doFilter(request, response);
    }

    /**
     * HTTP 요청의 Authorization 헤더에서 JWT 토큰을 추출하는 메서드
     *
     * @param request HTTP 요청 객체
     * @return Bearer 접두사가 제거된 JWT 토큰 문자열, 토큰이 없거나 유효하지 않은 형식이면 null 반환
     */
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken;
        }

        String paramToken = request.getParameter("token");
        if (paramToken != null && !paramToken.isEmpty()) {
            return paramToken;
        }
        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/api/auth/") || path.equals("/api/pot/search") || path.equals("/api/pot/near") || path.equals("/api/pot") ||
               path.startsWith("/h2-console/");
//               path.startsWith("/h2-console/") || path.equals("/api/user/me");
    }

}
