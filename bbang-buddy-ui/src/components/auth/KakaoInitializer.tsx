"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        Kakao: {
            init: (key: string) => void;
            isInitialized: () => boolean;
            Auth: {
                login: (options: {
                    success: (authObj: { access_token: string }) => void;
                    fail: (error: unknown) => void;
                }) => void;
            };
        };
    }
}

const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY || "";

export default function KakaoInitializer() {
    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(kakaoKey);
        }
    }, []);

    return null;
}
