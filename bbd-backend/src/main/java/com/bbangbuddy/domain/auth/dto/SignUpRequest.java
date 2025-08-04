package com.bbangbuddy.domain.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * @PackageName : com.bbangbuddy.domain.auth.dto
 * @FileName : SignUpRequest
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description :  회원가입 요청 시 클라이언트가 보내는 데이터
 */
@AllArgsConstructor
@ToString
@NoArgsConstructor
@Getter
@Builder
public class SignUpRequest {

    private Long id;

    @NotBlank(message = "사용자 아이디는 필수입니다")
    @Size(min = 4, max = 20, message = "아이디는 4~20자 사이여야 합니다")
    private String userId;

    @NotBlank(message = "사용자 이름은 필수입니다")
    @Size(min = 2, max = 50, message = "이름은 2~50자 사이여야 합니다")
    private String username;

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
            message = "비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다")
    private String password;

    private String uid;

    @NotNull(message = "역할은 필수입니다")
    private Long roleId;

    @NotBlank(message = "제공자 정보는 필수입니다")
    private String provider;

}