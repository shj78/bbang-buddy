package com.bbangbuddy.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

/**
 * @PackageName : com.bbangbuddy.domain.user.domain
 * @FileName : QandADto
 * @Author : hjsim
 * @Date : 2025-07-20
 * @Description :  문의 제목과 내용을 저장하는 DTO 클래스
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QandADto {
    // 질문과 답변을 저장하는 클래스
    @NotBlank(message = "제목은 필수 입력입니다.")
    private String title;
    @NotBlank(message = "내용은 필수 입력입니다.")
    private String description;
}
