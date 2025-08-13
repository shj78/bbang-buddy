package com.bbangbuddy.domain.auth.service;

import com.bbangbuddy.domain.auth.dto.KakaoAuthResult;
import com.bbangbuddy.domain.auth.dto.KakaoLoginResponse;
import com.bbangbuddy.domain.auth.dto.SignUpRequest;
import com.bbangbuddy.domain.auth.jwt.JwtUtil;
import com.bbangbuddy.domain.auth.dto.KakaoUserResponse;
import com.bbangbuddy.domain.user.domain.Role;
import com.bbangbuddy.domain.user.domain.User;
import com.bbangbuddy.domain.user.repository.RoleRepository;
import com.bbangbuddy.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.Optional;

/**
 * @PackageName : com.bbangbuddy.domain.auth.kakao
 * @FileName : KakaoAuthService
 * @Author : hjsim
 * @Date : 2025-06-09
 * @Description :  카카오 OAuth 인증 코드를 통해 액세스 토큰을 발급받는 서비스
 */
@Service
@RequiredArgsConstructor
public class KakaoAuthService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;
    private final AuthService authService;

    public KakaoUserResponse getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<?> request = new HttpEntity<>(headers);

        ResponseEntity<KakaoUserResponse> response = restTemplate.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.GET,
                request,
                KakaoUserResponse.class
        );

        return response.getBody();
    }

    /**
     * 카카오 사용자 정보를 처리하고 JWT 토큰을 생성하는 메서드
     *
     * @param userInfo 카카오 사용자 정보
     * @return 생성된 JWT 토큰
     */
    public KakaoAuthResult  handleUserAndCreateJwt(KakaoUserResponse userInfo) {
        String email = userInfo.getKakaoAccount().getEmail();
        String nickname = userInfo.getKakaoAccount().getProfile().getNickname();
        Long kakaoId = userInfo.getId();

        Optional<User> userOpt = userRepository.findByEmail(email);

        User user = userOpt.orElseGet(() -> {
            return createNewUser(kakaoId.toString(), email, nickname);
        });

        // BBANG BUDDY용 JWT 토큰 생성 후 반환
        return KakaoAuthResult.builder()
                .user(user)
                .jwtToken(jwtUtil.createToken(user.getUserId()))
                .build();
    }

    public User createNewUser(String kakaoId, String email, String nickname) {
//        Role role = roleRepository.findById(1L)
//                .orElseThrow(() -> new RuntimeException("기본 역할이 존재하지 않습니다. ID: " + 1L));

        SignUpRequest signUpRequest = SignUpRequest.builder()
                .userId("kakao_" + kakaoId)
                .username(nickname)
                .email(email)
                .password("oauth")
                .roleId(1L)
                .uid(kakaoId)
                .provider("kakao")
                .build();
        return authService.saveUser(signUpRequest);
    }
    public KakaoLoginResponse loginWithKakao(String kakaoAccessToken) {
        if (kakaoAccessToken == null || kakaoAccessToken.isEmpty()) {
            throw new IllegalArgumentException("카카오 액세스 토큰이 필요합니다.");
        }

        KakaoUserResponse userInfo = getUserInfo(kakaoAccessToken);

        if (userInfo == null) {
            throw new IllegalStateException("카카오 사용자 정보를 가져올 수 없습니다.");
        }

        KakaoAuthResult userAndJwtToken = handleUserAndCreateJwt(userInfo);

        KakaoLoginResponse.User user = KakaoLoginResponse.User.builder()
                .email(userInfo.getKakaoAccount().getEmail())
                .nickname(userInfo.getKakaoAccount().getProfile().getNickname())
                .profileImage(userInfo.getKakaoAccount().getProfile().getProfileImageUrl())
                .userId("kakao_" + userInfo.getId())
                .provider(userAndJwtToken.getUser().getProvider())
                .createdAt(userAndJwtToken.getUser().getCreatedAt())
                .build();

        return KakaoLoginResponse.builder()
                .kakaoAccessToken(kakaoAccessToken)
                .jwtToken(userAndJwtToken.getJwtToken())
                .user(user)
                .build();
    }

}
