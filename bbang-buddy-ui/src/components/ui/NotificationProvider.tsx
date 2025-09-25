"use client";

import { useEffect } from "react";
import useNotification from "../../hooks/useNotification";
import { useAuthStore } from "../../store/useAuthStore";

//Context 제공없이 마운트/로그인 시점에 useNotification 훅을 호출하여 알림 확인
const NotificationProvider = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { checkForNewNotifications } = useNotification();

    // 로그인 또는 마운트 상태가 변경될 때 알림 확인
    useEffect(() => {
        if (isAuthenticated) {
            checkForNewNotifications();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    // 이 컴포넌트는 UI를 렌더링하지 않음 (백그라운드 작업만)
    return null;
};

export default NotificationProvider;
