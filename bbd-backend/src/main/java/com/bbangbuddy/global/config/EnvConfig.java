package com.bbangbuddy.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * @PackageName : com.bbangbuddy.global.config
 * @FileName : EnvConfig
 * @Author : hjsim
 * @Date : 2025-07-03
 * @Description :  env 설정 관련 클래스
 */
@Configuration
public class EnvConfig {
    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();

        try {
            String rootPath = System.getProperty("user.dir");
            String envPath = rootPath + "/bbang-buddy-api/.env";

            File envFile = new File(envPath);
            if (!envFile.exists()) {
                envPath = rootPath + "/.env";
                envFile = new File(envPath);
            }

            if (envFile.exists()) {
                Properties props = new Properties();
                // File 객체를 바이트 단위로 읽을 수 있는 스트림으로 변환 후 파일을 열어서 바이트 데이터 읽을 준비를 함
                // 스트림에서 바이트 객체를 읽고 k,v로 저장 한 후 Properties 객체의 해시테이블에 저장
                props.load(new FileInputStream(envFile));

                // 환경 변수로 설정
                props.forEach((key, value) -> System.setProperty(key.toString(), value.toString()));

                // configurer.setProperties()로 스프링 설정에 직접 주입
                configurer.setProperties(props);
                System.out.println("Loaded properties: " + props);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to load .env file", e);
        }

        configurer.setIgnoreUnresolvablePlaceholders(false);
        configurer.setIgnoreResourceNotFound(false);
        return configurer;
    }
}
