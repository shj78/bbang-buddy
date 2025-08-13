package com.bbangbuddy.domain.notification.api;

import com.bbangbuddy.domain.notification.dto.NotificationRequestDto;
import com.bbangbuddy.domain.notification.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;

/**
 * NotificationApi 컨트롤러 테스트
 * 
 * 테스트 목적: 알림 관련 HTTP 요청/응답이 올바르게 처리되는지 검증
 * @WebMvcTest를 사용하여 웹 레이어만 로드하고 서비스는 Mock으로 처리
 */
@WithMockUser
@WebMvcTest(NotificationApi.class)
@DisplayName("NotificationApi 컨트롤러 테스트")
class NotificationApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JpaMetamodelMappingContext jpaMetamodelMappingContext;

    @MockBean
    private NotificationService notificationService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private NotificationRequestDto notificationRequest;

    @BeforeEach
    void setUp() {
        notificationRequest = new NotificationRequestDto();
        notificationRequest.setUserId("jupiterUser");
        notificationRequest.setMessage("테스트 알림 메시지");
    }

    @Test
    @DisplayName("SSE 구독 API 테스트")
    void subscribe_success() throws Exception {
        // Given
        String token = "Bearer jwt.test.token";
        SseEmitter mockEmitter = mock(SseEmitter.class);
        given(notificationService.subscribe(token)).willReturn(mockEmitter);

        // When & Then
        mockMvc.perform(get("/api/notification/subscribe")
                        .param("token", token))
                .andDo(print())
                .andExpect(status().isOk());
        
        verify(notificationService, times(1)).subscribe(token);
    }

    @Test
    @WithMockUser
    @DisplayName("알림 전송 API 테스트")
    void sendNotification_success() throws Exception {
        // Given
        doNothing().when(notificationService).send(anyString(), anyString());

        // When & Then
        mockMvc.perform(post("/api/notification/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notificationRequest))
                        .with(csrf()))
                .andDo(print())
                .andExpect(status().isOk());
        
        verify(notificationService, times(1)).send("jupiterUser", "테스트 알림 메시지");
    }

    @Test
    @DisplayName("알림 전송 API 테스트 - 유효성 검증 실패")
    void sendNotification_validationFail() throws Exception {
        // Given - userId가 빈 값
        NotificationRequestDto invalidRequest = new NotificationRequestDto();
        invalidRequest.setUserId(""); // 빈 값
        invalidRequest.setMessage("테스트 메시지");

        // When & Then
        mockMvc.perform(post("/api/notification/send")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidRequest))
                    .with(csrf()))
                .andDo(print())
                .andExpect(status().is4xxClientError());
        
        verify(notificationService, never()).send(anyString(), anyString());
    }
} 