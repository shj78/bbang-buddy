package com.bbangbuddy.domain.pot.dto;

import com.bbangbuddy.domain.pot.domain.Pot;
import com.bbangbuddy.domain.user.domain.User;
import com.bbangbuddy.global.util.QFileVariable;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * @PackageName : com.bbangbuddy.domain.pot.dto
 * @FileName : PotDto
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 빵팟 관련 데이터 전송 객체 (DTO) 클래스
 */
public class PotDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Upsert {
        private Long id;
        private String userId;
        private String title;
        private String description;
        private Double latitude;
        private Double longitude;
        private String address;
        private Integer maxParticipants;
        private Integer currentParticipants;
        private LocalDateTime dueDate;
        private MultipartFile image;
        private String imagePath;
        private String originalFileName;
        private String chatRoomUrl;
        private User createdAt;
        private LocalDateTime updatedAt;
        private Long createdBy;

        public Pot toEntity(Long id) {
            return Pot.builder()
                    .title(title)
                    .description(description)
                    .latitude(latitude)
                    .longitude(longitude)
                    .address(address)
                    .maxParticipants(maxParticipants)
                    .currentParticipants(currentParticipants != null ? currentParticipants : 0)
                    .dueDate(dueDate)
                    .createdBy(id)
                    .build();
        }

    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Delete {
        @NotBlank(message = "팟 ID는 필수입니다.")
        private Long id;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private Double latitude;
        private Double longitude;
        private String address;
        private Integer maxParticipants;
        private Integer currentParticipants;
        private LocalDateTime dueDate;
        private String imagePath;
        private String originalFileName;
        private String chatRoomUrl;
        private Long createdBy;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response from(Pot pot) {
            return Response.builder()
                    .id(pot.getId())
                    .title(pot.getTitle())
                    .description(pot.getDescription())
                    .latitude(pot.getLatitude())
                    .longitude(pot.getLongitude())
                    .address(pot.getAddress())
                    .maxParticipants(pot.getMaxParticipants())
                    .currentParticipants(pot.getCurrentParticipants())
                    .dueDate(pot.getDueDate())
                    .imagePath(pot.getImagePath())
                    .originalFileName(pot.getOriginalFileName())
                    .chatRoomUrl(pot.getChatRoomUrl())
                    .createdBy(pot.getCreatedBy())
                    .createdAt(pot.getCreatedAt())
                    .updatedAt(pot.getUpdatedAt())
                    .build();
        }

        public static Response from(PotProjection projection) {
            return Response.builder()
                    .id(projection.getId())
                    .title(projection.getTitle())
                    .description(projection.getDescription())
                    .latitude(projection.getLatitude())
                    .longitude(projection.getLongitude())
                    .maxParticipants(projection.getMaxParticipants())
                    .currentParticipants(projection.getCurrentParticipants())
                    .dueDate(projection.getDueDate())
                    .imagePath(projection.getImagePath())
                    .originalFileName(projection.getOriginalFileName())
                    .chatRoomUrl(projection.getChatRoomUrl())
                    .createdBy(projection.getCreatedBy())
                    .createdAt(projection.getCreatedAt())
                    .updatedAt(projection.getUpdatedAt())
                    .address(projection.getAddress())
                    .build();
        }
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Search {
        @QFileVariable(qClassName = "pot")
        private String title;
        @QFileVariable(qClassName = "pot")
        private String description;
        @QFileVariable(qClassName = "pot")
        private String address;
    }

}