import axios from "axios";
import { getCookie } from "../utils/cookieUtils";

// API 클라이언트 설정, axios 인스턴스 설정
const apiClient = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    baseURL: "http://localhost:8080",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
    (config) => {
        // 저장된 토큰이 있으면 자동으로 추가
        const token = getCookie("authToken");
        if (token && !config.headers["Authorization"]) {
            config.headers["Authorization"] = `${token}`;
        } else if (!token) {
            console.warn("❌ 토큰이 없습니다!");
        }

        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
            delete config.headers["content-type"];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
// 모든 API 응답 전에 자동으로 실행되어 응답 상태와 데이터를 콘솔에 출력
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("❌ API 응답 에러 상세:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            서버응답데이터: error.response?.data,
            에러메시지: error.message,
            요청데이터: error.config?.data,
        });
        return Promise.reject(error);
    }
);

export default apiClient;
