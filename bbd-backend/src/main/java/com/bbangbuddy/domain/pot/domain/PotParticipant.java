package com.bbangbuddy.domain.pot.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * @PackageName : com.bbangbuddy.domain.pot.domain
 * @FileName : PotParticipant
 * @Author : hjsim
 * @Date : 2025-06-12
 * @Description :  빵팟 참여자 엔티티
 */
@Entity
@Table(name = "BBANGPOT_PARTICIPANT")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(PotParticipantId.class)
public class PotParticipant implements Serializable {

    @Id
    @Column(name = "BBANGPOT_ID")
    private Long potId;

    @Id
    @Column(name = "BBD_USER_ID")
    private String userId;

    @Column(name = "JOINED_AT", updatable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    protected void onCreate() {
        this.joinedAt = LocalDateTime.now();
    }

}