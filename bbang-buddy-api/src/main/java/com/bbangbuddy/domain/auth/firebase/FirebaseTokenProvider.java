package com.bbangbuddy.domain.auth.firebase;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Component;

/**
 * @PackageName : com.bbangbuddy.domain.auth.firebase
 * @FileName : FirebaseTokenProvider
 * @Author : hjsim
 * @Date : 2025-06-11
 * @Description :  Firebase ID 토큰을 검증하는 컴포넌트
 */
@Component
public class FirebaseTokenProvider {

    public FirebaseToken verifyIdToken(String idToken) {
        try {
            // Firebase에서 ID 토큰 유효성 검증하고 FirebaseToken 객체를 반환
            return FirebaseAuth.getInstance().verifyIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new IllegalArgumentException("❌ 유효하지 않은 Firebase 토큰입니다.");
        }
    }

}

