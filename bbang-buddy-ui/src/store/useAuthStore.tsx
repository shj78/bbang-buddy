import { create } from "zustand";
import { getCookie, deleteCookie } from "../utils/cookieUtils";
import { User } from "../types/auth";
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    setUser: (userData: User) => void;
    clearUser: () => void;
    initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null, //사용자 정보
    isAuthenticated: false, //인증 여부
    isInitialized: false, //초기화 여부
    setUser: (userData: User) => {
        set({ user: userData, isAuthenticated: true });
    },
    clearUser: () => {
        deleteCookie("authToken");
        deleteCookie("userData");
        set({ user: null, isAuthenticated: false });
    },
    initializeAuth: () => {
        // 컴포넌트 마운트 시 쿠키와 localStorage에서 인증 상태 복원
        const token = getCookie("authToken");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                set({
                    user: parsedUser,
                    isAuthenticated: true,
                    isInitialized: true,
                });
            } catch (error) {
                //쿠키 데이터가 잘못된 경우 제거
                console.error("쿠키 파싱 오류:", error);
                deleteCookie("authToken");
                localStorage.removeItem("userData");
                set({
                    user: null,
                    isAuthenticated: false,
                    isInitialized: true,
                });
            }
        } else {
            set({ user: null, isAuthenticated: false, isInitialized: true });
        }
    },
}));
