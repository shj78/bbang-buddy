package com.bbangbuddy;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.h2.tools.Server;

import java.sql.SQLException;


@EnableJpaAuditing
@ConfigurationPropertiesScan
@SpringBootApplication (scanBasePackages = {"com.bbangbuddy"})
@Slf4j
public class BbangBuddyApplication {

    public static void main(String[] args) {

        try {
            Server.createTcpServer("-tcp", "-tcpAllowOthers", "-tcpPort", "9093").start();
            log.info("✅ H2 TCP Server started on port 9093");
        } catch (SQLException e) {
            log.info("❌ Failed to start H2 TCP Server: " + e.getMessage());
        }
        
        SpringApplication.run(BbangBuddyApplication.class, args);
    }

}

