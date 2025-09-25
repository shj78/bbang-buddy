// 회원가입 요청 데이터
export interface SignupRequest {
    userId: string;
    username: string;
    password: string;
    email: string;
    roleId: number;
    provider: string;
}

// 로그인 요청 데이터
export interface LoginRequest {
    userId: string;
    password: string;
}

// 인증 응답 데이터
export interface AuthResponse {
    token: string;
    user: User;
}

// 사용자 정보
export interface User {
    userId: string;
    email: string;
    username: string;
    nickname?: string;
    userId?: string;
    createdAt: string;
    provider?: "local" | "kakao" | "google"; // 로그인 방식 추가
}
