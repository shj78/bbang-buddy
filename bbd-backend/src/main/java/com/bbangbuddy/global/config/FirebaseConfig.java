package com.bbangbuddy.global.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * @PackageName : com.bbangbuddy.global.config
 * @FileName : FirebaseConfig
 * @Author : hjsim
 * @Date : 2025-06-11
 * @Description : Firebase Admin SDK를 사용하여 Firebase 서비스를 초기화하는 설정 클래스
 */
@Slf4j
@Configuration
@ConfigurationProperties(prefix = "firebase")
@Setter
@Profile("!test") // 테스트 프로파일에서는 Firebase 초기화 생략
public class FirebaseConfig {

    private String configPath;

    /**
     * Firebase 초기화
     * Firebase Admin SDK를 사용하여 Firebase 서비스를 초기화합니다.
     * 서비스 계정 키 파일(firebase-adminsdk.json)을 사용하여 인증을 수행합니다.
     */
    @PostConstruct
    public void init() {
        try (InputStream serviceAccount = new FileInputStream(configPath)) {
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                log.info("✅ Firebase 초기화 완료 (설정 파일: {})", configPath);
            }

        } catch (IOException e) {
            throw new RuntimeException("Firebase 초기화 실패", e);
        }
    }

    @Bean
    public FirebaseAuth firebaseAuth() throws IOException {
        return FirebaseAuth.getInstance();
    }

}

