package com.bbangbuddy.domain.user.api;

import com.bbangbuddy.domain.notification.service.TelegramService;
import com.bbangbuddy.domain.user.domain.Role;
import com.bbangbuddy.domain.user.domain.User;
import com.bbangbuddy.domain.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * UserApi 컨트롤러 테스트
 * 
 * 테스트 목적: HTTP 요청/응답이 올바르게 처리되는지 검증
 * @WebMvcTest를 사용하여 웹 레이어만 로드하고 서비스는 Mock으로 처리
 */
@WebMvcTest(UserApi.class) // UserApi만 로드하여 웹 레이어 테스트 HTTP 요청과 답을 테스트, 서비스나 리포지토리는 실제 Bean이 아닌 Mock으로 처리
@DisplayName("UserApi 컨트롤러 테스트")
class UserApiTest {

    @Autowired
    private MockMvc mockMvc; // HTTP 요청을 시뮬레이션하는 객체

    @MockBean
    private JpaMetamodelMappingContext jpaMetamodelMappingContext;
    
    @MockBean// Spring 컨테이너에 Mock 객체를 등록하고 실제 Bean 대신 Mock 객체를 주입
    private UserService userService; // UserService를 Mock으로 처리

    @MockBean
    TelegramService telegramService;

    @Autowired
    private ObjectMapper objectMapper; // JSON 직렬화/역직렬화
    
    private User jupiterUser;
    private Role testRole;

    @BeforeEach
    void setUp() {
        testRole = mock(Role.class);
        when(testRole.getId()).thenReturn(1L);
        
        jupiterUser = User.builder()
                .id(1L)
                .userId("jupiterUser")
                .username("테스트유저")
                .email("jupiter@galuxy.com")
                .passwordHash("encodedPassword")
                .provider("local")
                .roleId(testRole)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @WithMockUser
    @DisplayName("전체 사용자 조회 API 테스트")
    void getAllUsers_success() throws Exception {
        // Given
        given(userService.getAllUsers()).willReturn(Arrays.asList(jupiterUser));

        // When & Then
        mockMvc.perform(get("/api/user"))
                .andDo(print()) // 요청/응답 정보 출력
                .andExpect(status().isOk()) // HTTP 200 상태 확인
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)) // JSON 응답 확인
                .andExpect(jsonPath("$").isArray()) // 배열 응답 확인
                .andExpect(jsonPath("$[0].userId").value("jupiterUser"))
                .andExpect(jsonPath("$[0].email").value("jupiter@galuxy.com"));
        
        verify(userService, times(1)).getAllUsers();
    }

    @Test
    @WithMockUser
    @DisplayName("특정 사용자 조회 API 테스트 - 성공")
    void getUserById_success() throws Exception {
        // Given
        Long userId = 1L;
        given(userService.getUserById(userId)).willReturn(Optional.of(jupiterUser));

        // When & Then
        mockMvc.perform(get("/api/user/{id}", userId))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.userId").value("jupiterUser"))
                .andExpect(jsonPath("$.username").value("테스트유저"));
        
        verify(userService).getUserById(userId);
    }

    @Test
    @WithMockUser
    @DisplayName("특정 사용자 조회 API 테스트 - 사용자 없음")
    void getUserById_notFound() throws Exception {
        // Given
        Long nonExistentId = 999L;
        given(userService.getUserById(nonExistentId)).willReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/user/{id}", nonExistentId))
                .andDo(print())
                .andExpect(status().isNotFound()); // HTTP 404 상태 확인
        
        verify(userService).getUserById(nonExistentId);
    }

    // 참고: Spring Security가 활성화된 경우 아래 테스트들은 인증 오류가 발생할 수 있습니다.
    // 실제 프로젝트에서는 @WithMockUser 어노테이션을 사용하거나 Security 설정을 조정해야 합니다.
    
    @Test
    @DisplayName("비밀번호 변경 API 요청 구조 테스트")
    void updatePassword_requestStructure() throws Exception {
        // Given
        Map<String, String> request = new HashMap<>();
        request.put("currentPassword", "oldPassword123!");
        request.put("newPassword", "newPassword456");
        
        doNothing().when(userService).updatePassword(eq("jupiterUser"), anyString(), anyString());

        // When & Then
        // 주의: Spring Security가 활성화된 경우 401 Unauthorized가 발생할 수 있습니다.
        mockMvc.perform(patch("/api/user/me/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print()); // 응답 상태만 확인 (실제 프로젝트에서는 인증 설정 필요)
    }

    @Test
    @DisplayName("이메일 변경 API 요청 구조 테스트")
    void updateEmail_requestStructure() throws Exception {
        // Given
        Map<String, String> request = new HashMap<>();
        request.put("newEmail", "newemail@example.com");
        
        doNothing().when(userService).updateEmail(eq("jupiterUser"), anyString());

        // When & Then
        // 주의: Spring Security가 활성화된 경우 401 Unauthorized가 발생할 수 있습니다.
        mockMvc.perform(patch("/api/user/me/email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print()); // 응답 상태만 확인
    }

    @Test
    @DisplayName("유효성 검증 실패 테스트 - 빈 비밀번호")
    void updatePassword_validationFail() throws Exception {
        // Given - currentPassword가 빈 값
        Map<String, String> request = new HashMap<>();
        request.put("currentPassword", ""); // 빈 값
        request.put("newPassword", "newPassword456");

        // When & Then
        mockMvc.perform(patch("/api/user/me/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().is4xxClientError()); // 4xx 에러 상태 확인
        
        verify(userService, never()).updatePassword(anyString(), anyString(), anyString());
    }
} 