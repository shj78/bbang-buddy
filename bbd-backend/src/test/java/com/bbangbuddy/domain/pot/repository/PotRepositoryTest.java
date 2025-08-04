package com.bbangbuddy.domain.pot.repository;

import com.bbangbuddy.domain.pot.domain.Pot;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * PotRepository 데이터 접근 테스트
 * 
 * 테스트 목적: 팟 데이터 접근 로직이 올바르게 동작하는지 검증
 * @DataJpaTest를 사용하여 JPA 관련 컴포넌트만 로드하고 실제 데이터베이스와 테스트
 */
@DataJpaTest
@ActiveProfiles("test")
@DisplayName("PotRepository 데이터 접근 테스트")
class PotRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private PotRepository potRepository;
    
    private Pot testPot;

    @BeforeEach
    void setUp() {
        // Pot 생성 및 저장
        testPot = Pot.builder()
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
        testPot = entityManager.persistAndFlush(testPot);
        
        entityManager.clear();
    }

    @Test
    @DisplayName("팟 ID로 조회 테스트")
    void findById_success() {
        // When
        Optional<Pot> foundPot = potRepository.findById(testPot.getId());

        // Then
        assertThat(foundPot).isPresent();
        assertThat(foundPot.get().getTitle()).isEqualTo("테스트 팟");
        assertThat(foundPot.get().getDescription()).isEqualTo("테스트용 팟입니다");
        assertThat(foundPot.get().getMaxParticipants()).isEqualTo(5);
    }

    @Test
    @DisplayName("존재하지 않는 팟 ID로 조회 테스트")
    void findById_notFound() {
        // When
        Optional<Pot> foundPot = potRepository.findById(999L);

        // Then
        assertThat(foundPot).isEmpty();
    }

    @Test
    @DisplayName("모든 팟 조회 테스트")
    void findAll_success() {
        // Given - 추가 팟 생성
        Pot additionalPot = Pot.builder()
                .title("추가 팟")
                .description("추가 팟입니다")
                .latitude(37.5665)
                .longitude(126.9780)
                .address("서울시 강남구")
                .maxParticipants(3)
                .currentParticipants(1)
                .dueDate(LocalDateTime.now().plusDays(5))
                .createdBy(2L)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        entityManager.persistAndFlush(additionalPot);

        // When
        List<Pot> allPots = potRepository.findAll();

        // Then
        assertThat(allPots).hasSize(2);
        assertThat(allPots).extracting(Pot::getTitle)
                .contains("테스트 팟", "추가 팟");
    }

    @Test
    @DisplayName("팟 저장 테스트")
    void save_success() {
        // Given
        Pot newPot = Pot.builder()
                .title("새로운 팟")
                .description("새로 생성된 팟입니다")
                .latitude(37.5665)
                .longitude(126.9780)
                .address("서울시 서초구")
                .maxParticipants(4)
                .currentParticipants(0)
                .dueDate(LocalDateTime.now().plusDays(10))
                .createdBy(3L)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // When
        Pot savedPot = potRepository.save(newPot);

        // Then
        assertThat(savedPot.getId()).isNotNull();
        assertThat(savedPot.getTitle()).isEqualTo("새로운 팟");
        assertThat(savedPot.getCreatedBy()).isEqualTo(3L);
        
        // 데이터베이스에서 실제로 저장되었는지 확인
        Optional<Pot> foundPot = potRepository.findById(savedPot.getId());
        assertThat(foundPot).isPresent();
    }

    @Test
    @DisplayName("팟 삭제 테스트")
    void delete_success() {
        // Given
        Long potId = testPot.getId();

        // When
        potRepository.deleteById(potId);

        // Then
        Optional<Pot> deletedPot = potRepository.findById(potId);
        assertThat(deletedPot).isEmpty();
    }

    @Test
    @DisplayName("근처 팟 조회 네이티브 쿼리 테스트")
    void findNearbyPots_success() {
        // Given - 서울 중심 좌표
        double latitude = 37.5665;
        double longitude = 126.9780;
        int distance = 10; // 10km

        // When
        List<?> nearbyPots = potRepository.findNearbyPots(latitude, longitude, distance);

        // Then
        assertThat(nearbyPots).isNotEmpty();
        // 실제 프로젝트에서는 거리 계산 로직이 정확한지 검증해야 함
    }
} 