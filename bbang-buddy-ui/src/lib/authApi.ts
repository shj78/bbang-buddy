import apiClient from "./apiClient";
import { LoginRequest, SignupRequest } from "../types/auth";

// 회원가입
export const signUp = async (signUpRequest: SignupRequest) => {
    const response = await apiClient.post("/api/auth/signup", signUpRequest);
    return response.data;
};

// 로그인
export const signIn = async (loginRequest: LoginRequest) => {
    const response = await apiClient.post("/api/auth/login", loginRequest);
    return response.data;
};

// Firebase를 통한 구글 로그인
export const loginWithGoogle = async (token: string) => {
    const response = await apiClient.post("/api/auth/firebase/google", {
        idToken: token,
    });
    return response.data;
};

// 카카오톡 API를 통한 로그인
export const loginWithKakao = async (token: string) => {
    const response = await apiClient.post(
        "/api/auth/kakao",
        { token },
        {
            headers: {
                // Authorization 헤더는 제거 - body의 token만 사용
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};
