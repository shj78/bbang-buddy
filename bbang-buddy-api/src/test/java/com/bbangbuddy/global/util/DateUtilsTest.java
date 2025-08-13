package com.bbangbuddy.global.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * DateUtils 테스트 클래스
 * 
 * 테스트 목적: DateUtils의 정적 메서드들이 올바르게 동작하는지 검증
 * 외부 의존성이 없는 순수 메서드들이므로 JUnit만 사용
 */
@DisplayName("DateUtils 테스트") // 클래스 전체에 대한 설명
class DateUtilsTest {
    
    @Test
    @DisplayName("유효한 날짜 형식 검증 테스트")
    void validationDate_success() {
        // Given
        String validDate = "2024-01-15";
        String format = "yyyy-MM-dd";
        
        // When
        boolean result = DateUtils.validationDate(validDate, format);
        
        // Then
        assertTrue(result, "유효한 날짜 형식이므로 true를 반환해야 함");
    }
    
    @Test
    @DisplayName("잘못된 날짜 형식 검증 테스트")
    void validationDate_invalid() {
        // Given
        String invalidDate = "2024-13-40"; // 13월 40일은 없음
        String format = "yyyy-MM-dd";
        
        // When
        boolean result = DateUtils.validationDate(invalidDate, format);
        
        // Then
        assertFalse(result, "잘못된 날짜 형식이므로 false를 반환해야 함");
    }
    
    @Test
    @DisplayName("다양한 날짜 형식 검증 테스트")
    void validationDate_variousFormats() {
        // Given & When & Then
        assertTrue(DateUtils.validationDate("2024/01/15", "yyyy/MM/dd"));
        assertTrue(DateUtils.validationDate("15-01-2024", "dd-MM-yyyy"));
        assertFalse(DateUtils.validationDate("2024-01-15", "yyyy/MM/dd")); // 형식 불일치
        assertFalse(DateUtils.validationDate("invalid-date", "yyyy-MM-dd"));
    }
    
    @Test
    @DisplayName("LocalDateTime 파싱 테스트 - 날짜만")
    void parseLocalDateTime_dateOnly() {
        // Given
        String date = "2024-01-15";
        String format = "yyyy-MM-dd";
        
        // When
        LocalDateTime result = DateUtils.parseLocalDateTime(date, format);
        
        // Then
        assertEquals(2024, result.getYear());
        assertEquals(1, result.getMonthValue());
        assertEquals(15, result.getDayOfMonth());
        assertEquals(0, result.getHour()); // 시간이 없으면 0시 0분 0초
        assertEquals(0, result.getMinute());
        assertEquals(0, result.getSecond());
    }
    
    @Test
    @DisplayName("LocalDateTime 파싱 테스트 - 날짜와 시간")
    void parseLocalDateTime_dateTime() {
        // Given
        String dateTime = "2024-01-15 14:30:45";
        String format = "yyyy-MM-dd HH:mm:ss";
        
        // When
        LocalDateTime result = DateUtils.parseLocalDateTime(dateTime, format);
        
        // Then
        assertEquals(2024, result.getYear());
        assertEquals(1, result.getMonthValue());
        assertEquals(15, result.getDayOfMonth());
        assertEquals(14, result.getHour());
        assertEquals(30, result.getMinute());
        assertEquals(45, result.getSecond());
    }
    
    @Test
    @DisplayName("LocalDate 파싱 테스트")
    void parseLocalDate_success() {
        // Given
        String date = "2024-01-15";
        String format = "yyyy-MM-dd";
        
        // When
        LocalDate result = DateUtils.parseLocalDate(date, format);
        
        // Then
        assertEquals(LocalDate.of(2024, 1, 15), result);
    }
    
    @Test
    @DisplayName("잘못된 형식으로 파싱 시도 시 예외 발생")
    void parseLocalDateTime_invalidFormat_throwsException() {
        // Given
        String invalidDate = "invalid-date";
        String format = "yyyy-MM-dd";
        
        // When & Then
        assertThrows(Exception.class, () -> {
            DateUtils.parseLocalDateTime(invalidDate, format);
        }, "잘못된 날짜 형식은 예외를 발생시켜야 함");
    }
} 