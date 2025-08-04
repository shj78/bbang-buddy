package com.bbangbuddy.domain.pot.dto;

import com.bbangbuddy.domain.pot.domain.PotParticipant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * @PackageName : com.bbangbuddy.domain.pot.dto
 * @FileName : PotParticipantDto
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 빵팟 참여자 관련 데이터 전송 객체 (DTO) 클래스
 */
public class PotParticipantDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private Long potId;
        private String userId;
        private String notificationMessage;

        public PotParticipant toEntity() {
            return PotParticipant.builder()
                    .potId(potId)
                    .userId(userId)
                    .build();
        }
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class Response {
        private Long potId;
        private String userId;
        private LocalDateTime joinedAt;

        public static Response from(PotParticipant participant) {
            return Response.builder()
                    .potId(participant.getPotId())
                    .userId(participant.getUserId())
                    .joinedAt(participant.getJoinedAt())
                    .build();
        }
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Search {
        private Long potId;
        private String userId;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Delete {
        private Long potId;
        private String userId;
    }

}