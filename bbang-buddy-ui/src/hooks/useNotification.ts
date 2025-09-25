"use client";

import { useEffect, useRef } from "react";
import useNotificationStore from "../store/useNotificationStore";
import { useAuthStore } from "../store/useAuthStore";
import { getCookie } from "../utils/cookieUtils";

const useNotification = () => {
    const { getNotifications, addNotification } = useNotificationStore();
    const { isAuthenticated } = useAuthStore();
    const eventSourceRef = useRef<EventSource | null>(null);
    const token = getCookie("authToken");

    const getApiUrl = () => {
        // NEXT_PUBLIC_API_BASE_URL이 설정되어 있으면 우선 사용
        if (process.env.NEXT_PUBLIC_API_BASE_URL) {
            return process.env.NEXT_PUBLIC_API_BASE_URL;
        }

        // 백업: localhost 환경에서는 직접 연결
        if (
            typeof window !== "undefined" &&
            window.location.hostname === "localhost"
        ) {
            return "http://localhost:8080";
        }

        // 배포 환경에서는 현재 도메인 사용 (CORS 문제 해결)
        if (typeof window !== "undefined") {
            return window.location.origin;
        }

        return "http://localhost:8080";
    };

    // SSE 연결 로그인 시 한번만 요청
    useEffect(() => {
        if (!isAuthenticated || !token) {
            return;
        }

        const setupSSEConnection = async () => {
            try {
                if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                }

                // 연결 시점에 토큰을 새로 가져오기
                const currentToken = getCookie("authToken");
                const apiUrl = getApiUrl();
                // 로컬 환경에서는 /api를 추가하지 않음 (이미 백엔드 서버 주소)
                const sseUrl = `${apiUrl}/api/notification/subscribe?token=${encodeURIComponent(currentToken || "")}`

                // SSE 연결 생성 (토큰을 쿼리 파라미터로 전달)
                const eventSource = new EventSource(sseUrl);
                eventSourceRef.current = eventSource;

                // 새 알림 수신
                eventSource.onmessage = (event) => {
                    try {
                        const notification = JSON.parse(event.data);
                        addNotification(notification);
                    } catch (error) {
                        console.error("알림 데이터 파싱 오류:", error);
                    }
                };

                // 연결 상태 및 오류 처리
                eventSource.onopen = () => {
                    // SSE 연결 성공
                };

                eventSource.onerror = (error) => {
                    // 기존 연결 완전히 종료 (자동 재연결 방지)
                    if (eventSource.readyState !== EventSource.CLOSED) {
                        eventSource.close();
                    }
                    eventSourceRef.current = null;
                    console.error("알림 연결 오류:", error);

                    // 수동 재연결 (토큰을 다시 가져와서)
                    setTimeout(() => {
                        const currentToken = getCookie("authToken"); // 토큰 다시 가져오기
                        const { isAuthenticated } = useAuthStore.getState(); // 최신 인증 상태 가져오기

                        if (
                            isAuthenticated &&
                            currentToken &&
                            !eventSourceRef.current
                        ) {
                            setupSSEConnection();
                        }
                    }, 5000);
                };
            } catch (error) {
                console.error("알림 구독 실패:", error);
            }
        };

        setupSSEConnection();

        // 컴포넌트 언마운트 시 연결 종료
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [isAuthenticated, token, addNotification]);

    // 수동으로 새 알림 확인
    const checkForNewNotifications = async () => {
        try {
            if (token) {
                await getNotifications();
            }
        } catch (error) {
            console.error("알림 확인 중 오류:", error);
        }
    };

    return {
        checkForNewNotifications,
    };
};

export default useNotification;
