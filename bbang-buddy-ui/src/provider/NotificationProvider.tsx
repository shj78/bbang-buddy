"use client";

import { useEffect } from "react";
import useNotification from "../hooks/useNotification";
import { useAuthStore } from "../store/useAuthStore";
//마운트, 로그인 시점에 useNotification훅 호출 후 SSE 연결, 알림 가져오기 및 안읽은 알림 개수 계산
const NotificationProvider = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { checkForNewNotifications } = useNotification();

    // 로그인/마운트 상태가 변경될 때 알림 확인
    useEffect(() => {
        if (isAuthenticated) {
            checkForNewNotifications();
        }
    }, [isAuthenticated, checkForNewNotifications]);

    // 이 컴포넌트는 UI를 렌더링하지 않음 (백그라운드 작업만)
    return null;
};

export default NotificationProvider;
