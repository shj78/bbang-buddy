package com.bbangbuddy.domain.pot.domain;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.io.Serializable;

/**
 * @PackageName : com.bbangbuddy.domain.pot.domain
 * @FileName : PotParticipantId
 * @Author : hjsim
 * @Date : 2025-06-12
 * @Description :  빵팟과 참여자 간의 복합 키를 정의하는 클래스
 */
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class PotParticipantId implements Serializable {

    private static final long serialVersionUID = 6083811930405462569L;

    private Long potId;
    private String userId;

}