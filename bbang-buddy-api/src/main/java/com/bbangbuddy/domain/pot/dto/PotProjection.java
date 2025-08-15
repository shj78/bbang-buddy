package com.bbangbuddy.domain.pot.dto;

import org.springframework.beans.factory.annotation.Value;
import java.time.LocalDateTime;

/**
 * @PackageName : com.bbangbuddy.domain.pot.dto
 * @FileName : PotProjection
 * @Author : hjsim
 * @Date : 2025-06-22
 * @Description :  빵팟 조회 시 필요한 필드만 포함하는 프로젝션 인터페이스(제거 예정)
 */
public interface PotProjection {

    Long getId();
    String getTitle();
    @Value("#{target.description?.toString()}")
    String getDescription();
    Double getLatitude();
    Double getLongitude();
    //근처 팟 조회용 PotProjection 인터페이스로 주소 필드 제외
    Integer getMaxParticipants();
    Integer getCurrentParticipants();
    LocalDateTime getDueDate();
    String getImagePath();
    String getOriginalFileName();
    Long getCreatedBy();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
    String getAddress();
    String getChatRoomUrl();

}

