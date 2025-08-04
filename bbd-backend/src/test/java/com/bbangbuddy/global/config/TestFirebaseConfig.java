package com.bbangbuddy.global.config;

import com.google.firebase.auth.FirebaseAuth;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

/**
 * @PackageName : com.bbangbuddy.global.config
 * @FileName : TestFirebaseConfig
 * @Author : hjsim
 * @Date : 2025-07-20
 * @Description :  <br>
 */
@TestConfiguration
public class TestFirebaseConfig {
    @Bean
    public FirebaseAuth firebaseAuth() {
        return Mockito.mock(FirebaseAuth.class);
    }
}
