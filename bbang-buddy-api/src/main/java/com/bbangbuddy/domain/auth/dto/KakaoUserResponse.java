package com.bbangbuddy.domain.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * @PackageName : com.bbangbuddy.domain.auth.kakao
 * @FileName : KakaoUserResponse
 * @Author : hjsim
 * @Date : 2025-06-09
 * @Description :  카카오에서 제공하는 사용자 정보 응답 DTO
 */
@Getter
@Setter
public class KakaoUserResponse {

    private Long id;

    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    @Getter @Setter
    public static class KakaoAccount {
        private String email;
        private Profile profile;

        @Getter @Setter
        public static class Profile {
            private String nickname;
            private String profileImageUrl;
        }
    }

}
