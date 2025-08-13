package com.bbangbuddy.domain.pot.service;

import com.bbangbuddy.domain.notification.service.TelegramService;
import com.bbangbuddy.domain.pot.domain.Pot;
import com.bbangbuddy.domain.pot.domain.PotParticipant;
import com.bbangbuddy.domain.pot.dto.PotDto;
import com.bbangbuddy.domain.pot.repository.PotParticipantRepository;
import com.bbangbuddy.domain.pot.repository.PotRepository;
import com.bbangbuddy.domain.pot.repository.PotRepositorySupport;
import com.bbangbuddy.domain.user.domain.User;
import com.bbangbuddy.domain.user.repository.UserRepository;
import com.bbangbuddy.global.util.FileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

/**
 * PotService 단위 테스트
 * 
 * 테스트 목적: PotService의 각 메서드가 올바르게 동작하는지 검증
 * Mock을 사용하여 의존성을 격리
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("PotService 단위 테스트")
class PotServiceTest {

    @Mock
    private PotRepository potRepository;
    
    @Mock
    private PotParticipantRepository potParticipantRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private TelegramService telegramService;
    
    @Mock
    private WebClient webClient;
    
    @Mock
    private PotRepositorySupport potRepositorySupport;
    
    @InjectMocks
    private PotService potService;
    
    private Pot testPot;
    private User jupiterUser;
    private PotDto.Upsert testUpsert;
    private Long testDelete;

    @BeforeEach
    void setUp() {
        testPot = Pot.builder()
                .id(1L)
                .title("테스트 팟")
                .description("테스트용 팟입니다")
                .latitude(37.5665)
                .longitude(126.9780)
                .address("서울시 중구")
                .maxParticipants(5)
                .currentParticipants(2)
                .dueDate(LocalDateTime.now().plusDays(7))
                .createdBy(1L)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        jupiterUser = User.builder()
                .id(1L)
                .userId("jupiterUser")
                .username("테스트유저")
                .email("test@example.com")
                .build();

        testUpsert = PotDto.Upsert.builder()
                .title("새로운 팟")
                .description("새로운 팟입니다")
                .latitude(37.5665)
                .longitude(126.9780)
                .address("서울시 중구")
                .maxParticipants(5)
                .dueDate(LocalDateTime.now().plusDays(7))
                .build();

        testDelete = 1L;
    }

    @Test
    @DisplayName("모든 팟 조회 테스트")
    void getAllPots_success() {
        // Given
        List<Pot> expectedPots = Arrays.asList(testPot);
        given(potRepository.findAll()).willReturn(expectedPots);

        // When
        List<Pot> actualPots = potService.getAllPots();

        // Then
        assertThat(actualPots).hasSize(1);
        assertThat(actualPots.get(0).getTitle()).isEqualTo("테스트 팟");
        verify(potRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("팟 검색 테스트")
    void searchPots_success() {
        // Given
        PotDto.Response expectedResponse = PotDto.Response.from(testPot);
        List<PotDto.Response> expectedResponses = Arrays.asList(expectedResponse);
        given(potRepositorySupport.findBySearchCondition(any(PotDto.Search.class)))
                .willReturn(expectedResponses);

        // When
        List<PotDto.Response> actualResponses = potService.searchPots("테스트");

        // Then
        assertThat(actualResponses).hasSize(1);
        assertThat(actualResponses.get(0).getTitle()).isEqualTo("테스트 팟");
        verify(potRepositorySupport, times(1)).findBySearchCondition(any(PotDto.Search.class));
    }

    @Test
    @DisplayName("내 팟 목록 조회 테스트")
    void getMyPotList_success() {
        // Given
        String userId = "jupiterUser";
        PotParticipant participant = mock(PotParticipant.class);
        when(participant.getPotId()).thenReturn(1L);
        
        List<PotParticipant> participations = Arrays.asList(participant);
        List<Long> potIds = Arrays.asList(1L);
        List<Pot> pots = Arrays.asList(testPot);
        
        given(potParticipantRepository.findByUserId(userId)).willReturn(participations);
        given(potRepository.findAllById(potIds)).willReturn(pots);

        // When
        List<PotDto.Response> result = potService.getMyPotList(userId);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("테스트 팟");
        verify(potParticipantRepository).findByUserId(userId);
        verify(potRepository).findAllById(potIds);
    }

    @Test
    @DisplayName("팟 생성 테스트")
    void upsertPot_create_success() throws Exception {
        // WebClient mock 체이닝 - sendTelegramMessage 메서드 호출 시 WebClient의 체이닝 메서드가 필요하기 때문에 Mockito로 WebClient의 메서드를 처리할 때 명시적으로 체이닝을 설정하지 않으면 NPE
        WebClient.RequestBodyUriSpec requestBodyUriSpec = mock(WebClient.RequestBodyUriSpec.class);
        WebClient.RequestHeadersSpec requestHeadersSpec = mock(WebClient.RequestHeadersSpec.class);
        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);

        // Given
        String userId = "jupiterUser";
        given(userRepository.findByUserId(userId)).willReturn(Optional.of(jupiterUser));
        given(potRepository.save(any(Pot.class))).willReturn(testPot);

        // When
        Long result = potService.upsertPot(testUpsert, null, userId);

        // Then
        assertThat(result).isEqualTo(1L);
        verify(userRepository).findByUserId(userId);
        verify(potRepository).save(any(Pot.class));
    }

    @Test
    @DisplayName("팟 업데이트 테스트")
    void upsertPot_update_success() throws Exception {
        // Given
        String userId = "jupiterUser";
        testUpsert.setId(1L); // 기존 팟 ID 설정
        
        given(potRepository.findById(1L)).willReturn(Optional.of(testPot));
        given(potRepository.save(any(Pot.class))).willReturn(testPot);

        // When
        Long result = potService.upsertPot(testUpsert, null, userId);

        // Then
        assertThat(result).isEqualTo(1L);
        verify(potRepository).findById(1L);
        verify(potRepository).save(any(Pot.class));
    }

    @Test
    @DisplayName("팟 삭제 테스트")
    void deletePot_success() {
        // Given
        given(potRepository.findById(1L)).willReturn(Optional.of(testPot));
        doNothing().when(potRepository).deleteById(1L);

        // When
        potService.deletePot(testDelete);

        // Then
        verify(potRepository).findById(1L);
        verify(potRepository).deleteById(1L);
    }

    @Test
    @DisplayName("팟 삭제 실패 - 존재하지 않는 팟")
    void deletePot_notFound() {
        // Given
        given(potRepository.findById(1L)).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> potService.deletePot(testDelete))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("팟을 찾을 수 없습니다.");
        
        verify(potRepository).findById(1L);
        verify(potRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("팟 생성 실패 - 존재하지 않는 사용자")
    void upsertPot_userNotFound() {
        // Given
        String userId = "nonExistentUser";
        given(userRepository.findByUserId(userId)).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> potService.upsertPot(testUpsert, null, userId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("팟 저장에 실패했습니다: 유저를 찾을 수 없습니다.");
        
        verify(userRepository).findByUserId(userId);
        verify(potRepository, never()).save(any(Pot.class));
    }
} 