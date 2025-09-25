"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import useLocationStore from "../../store/useLocationStore";

// 초기화, 앱 새로고침 혹은 재실행시 실행
export default function AuthInitializer() {
    const { initializeAuth } = useAuthStore();
    const { getCurrentLocation } = useLocationStore();

    useEffect(() => {
        initializeAuth();
        getCurrentLocation();
    }, [initializeAuth, getCurrentLocation]);

    return null; // UI를 렌더링하지 않음
}
