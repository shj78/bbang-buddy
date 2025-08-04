package com.bbangbuddy.domain.notification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

/**
 * @PackageName : com.bbangbuddy.domain.notification.service
 * @FileName : TelegramService
 * @Author : hjsim
 * @Date : 2025-07-20
 * @Description :  텔레그램 메시지를 전송하는 서비스
 */
@RequiredArgsConstructor
@Service
public class TelegramService {
    private final WebClient webClient;

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.bot.chat-id}")
    private String chatId;

    public void sendTelegramMessage(String message) {
        String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";

        Map<String, String> body = new HashMap<>();
        body.put("chat_id", chatId);
        body.put("text", message);

        webClient.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(body))
                .retrieve()
                .bodyToMono(String.class)
                .subscribe();
    }
}
