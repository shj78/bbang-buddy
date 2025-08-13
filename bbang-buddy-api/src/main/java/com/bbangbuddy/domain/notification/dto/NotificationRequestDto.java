package com.bbangbuddy.domain.notification.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * @PackageName : com.bbangbuddy.domain.notification.dto
 * @FileName : NotificationRequestDto
 * @Author : hjsim
 * @Date : 2025-06-12
 * @Description :  알림 요청 시 클라이언트에게 보내는 데이터
 */
@Getter
@Setter
@NoArgsConstructor
public class NotificationRequestDto {

    @NotBlank(message = "사용자 ID는 필수입니다")
    private String userId;

    @NotBlank(message = "알림 메시지는 필수입니다")
    @Size(max = 500, message = "알림 메시지는 500자를 초과할 수 없습니다")
    private String message;

}
