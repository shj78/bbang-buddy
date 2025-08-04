package com.bbangbuddy.global.util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import javax.servlet.http.HttpServletRequest;

/**
 * @PackageName : com.bbangbuddy.global.util
 * @FileName : ApplicationContext
 * @Author : hjsim
 * @Date : 2025-06-10
 * @Description :  인증된 사용자 ID를 가져오는 유틸리티 클래스
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ApplicationContextUtils {

    public static HttpServletRequest getRequest() {
        // DispatcherServlet은 요청이 들어오면 요청과 응답 객체가 담긴 ServletRequestAttributes 객체를 생성한다.
        // ServletRequestAttributes는 스프링이 제공하는 클래스로 HTTP 요청 관련 정보를 저장하고 있다.
        // 그리고 RequestContextHolder 추상 클래스의 ThreadLocal에 현재 스레드의 요청 정보가 담긴 객체를 저장한다.
        // RequestContextHolder를 통해 현재 스레드의 요청 정보에 접근할 수 있다
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes == null ? null : attributes.getRequest();
    }

    public static String getUserId() {
        HttpServletRequest request = getRequest();
        if (request == null) return null;
        String userId = request.getHeader("userId");
        return StringUtils.isBlank(userId) ? (String) request.getAttribute("userId") : userId;
    }

}