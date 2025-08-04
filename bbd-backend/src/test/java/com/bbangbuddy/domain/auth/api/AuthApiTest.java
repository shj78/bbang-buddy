package com.bbangbuddy.domain.auth.api;

import com.bbangbuddy.domain.auth.dto.LoginRequest;
import com.bbangbuddy.domain.auth.dto.AuthResult;
import com.bbangbuddy.domain.auth.dto.SignUpRequest;
import com.bbangbuddy.domain.auth.service.AuthService;
import com.bbangbuddy.domain.user.domain.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

/**
 * AuthApi 컨트롤러 테스트
 * 
 * 테스트 목적: 인증 관련 HTTP 요청/응답이 올바르게 처리되는지 검증
 * @WebMvcTest를 사용하여 웹 레이어만 로드하고 서비스는 Mock으로 처리
 */
@WebMvcTest(AuthApi.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("AuthApi 컨트롤러 테스트")
class AuthApiTest {

    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private AuthService authService;

    @MockBean
    private JpaMetamodelMappingContext jpaMetamodelMappingContext;

    @Autowired
    private ObjectMapper objectMapper;
    
    private SignUpRequest signUpRequest;
    private LoginRequest loginRequest;
    private AuthResult authResult;

    @BeforeEach
    void setUp() {
        signUpRequest = SignUpRequest.builder()
            .userId("jupiterUser")
            .username("목성유저")
            .email("jupiter@galuxy.com")
            .password("password123!")
            .roleId(1L)
            .provider("local")
            .build();

        loginRequest = LoginRequest.builder()
            .userId("jupiterUser")
            .password("password123!")
            .build();

        User mockUser = User.builder()
                .id(1L)
                .userId("jupiterUser")
                .username("목성유저")
                .email("jupiter@galuxy.com")
                .build();
        authResult = new AuthResult(mockUser, "jwt.test.token");
    }

    @Test
    @DisplayName("회원가입 API 테스트 - 성공")
    void signUp_success() throws Exception {
        // Given
        User mockUser = mock(User.class);
        given(authService.saveUser(any(SignUpRequest.class))).willReturn(mockUser);

        // When & Then
        mockMvc.perform(post("/api/auth/signup")// 회원가입 API 엔드포인트에 POST 요청
                        .contentType(MediaType.APPLICATION_JSON)// 요청 본문 타입을 JSON으로 설정
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andDo(print())
                .andExpect(status().isOk());
        
        verify(authService, times(1)).saveUser(any(SignUpRequest.class));
    }

    @Test
    @DisplayName("회원가입 API 테스트 - 유효성 검증 실패")
    void signUp_validationFail() throws Exception {
        // Given - userId가 빈 값
        SignUpRequest invalidRequest = SignUpRequest.builder()
                .userId("") // 빈 값
                .username("목성유저")
                .email("jupiter@galuxy.com")
                .password("password123!")
                .roleId(1L)
                .provider("local")
                .build();

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andDo(print())
                .andExpect(status().is4xxClientError());
        
        verify(authService, never()).saveUser(any(SignUpRequest.class));//mockito를 사용하여 authService의 saveUser 메소드가 호출되지 않도록 검증
    }

    @Test
    @DisplayName("로그인 API 테스트 - 성공")
    void login_success() throws Exception {
        // Given
        given(authService.logIn(any(LoginRequest.class))).willReturn(authResult);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.jwtToken").value("jwt.test.token"));
        
        verify(authService, times(1)).logIn(any(LoginRequest.class));
    }

    @Test
    @DisplayName("로그인 API 테스트 - 유효성 검증 실패")
    void login_validationFail() throws Exception {
        // Given - password가 빈 값
         LoginRequest invalidRequest = LoginRequest.builder()
            .userId("testUser")
            .password("") // 빈 값
            .build();

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andDo(print())
                .andExpect(status().is4xxClientError());
        
        verify(authService, never()).logIn(any(LoginRequest.class));
    }

    @Test
    @DisplayName("로그인 API 테스트 - 서비스 예외 발생")
    void login_serviceException() throws Exception {
        // Given
        given(authService.logIn(any(LoginRequest.class)))
            .willThrow(new RuntimeException("존재하지 않는 사용자입니다."));

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andDo(print())
            .andExpect(status().is5xxServerError());
        
        verify(authService, times(1)).logIn(any(LoginRequest.class));
    }
} 