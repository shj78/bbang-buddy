import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { User } from "../types/auth";
import {
    signIn,
    signUp,
    loginWithGoogle,
    loginWithKakao,
} from "../lib/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setCookie } from "../utils/cookieUtils";

// 회원가입 훅
export const useSignup = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: signUp,
        onSuccess: () => {
            toast.success("회원가입 성공! 로그인해주세요.");
            router.push("/auth/login");
        },
        onError: (error: unknown) => {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("회원가입 실패");
            }
        },
    });
};

// 로그인 훅
export const useLogin = () => {
    //쿠키 처리
    const { setUser } = useAuthStore();
    const router = useRouter();

    return useMutation({
        mutationFn: signIn,
        onSuccess: (data) => {
            setUser(data.user);
            setCookie("authToken", `Bearer ${data.jwtToken}`);
            // 사용자 정보를 localStorage에 저장
            localStorage.setItem("userData", JSON.stringify(data.user));
            toast.success("로그인 성공!");
            router.push("/");
        },
        onError: (error) => {
            toast.error("로그인 실패");
            console.error("로그인 실패:", error);
        },
    });
};

// 카카오 로그인 훅 (useMutation) - 토큰을 파라미터로 받음
export const useKakaoLogin = () => {
    //쿠키 처리
    const { setUser } = useAuthStore();
    const router = useRouter();

    return useMutation({
        mutationFn: (accessToken: string) => loginWithKakao(accessToken),
        onSuccess: (data) => {
            if (!data.user) {
                toast.error("카카오 로그인 실패: 사용자 정보 없음");
                return;
            }
            setUser(data.user);
            setCookie("authToken", `Bearer ${data.jwtToken}`);
            // 사용자 정보를 localStorage에 저장
            localStorage.setItem("userData", JSON.stringify(data.user));

            toast.success("카카오 로그인 성공!");
            router.push("/");
        },
        onError: (error: unknown) => {
            console.error("❌ 카카오 로그인 실패 상세:", error);

            // 서버 응답 데이터에서 실제 에러 메시지 추출
            let errorMessage = "카카오 로그인 실패";

            if (error instanceof Error && "response" in error) {
                const response = (
                    error as Error & { response: { data: unknown } }
                ).response;
                if (response?.data) {
                    const data = response.data;
                    if (typeof data === "string") {
                        errorMessage = data;
                    } else if (data && typeof data === "object") {
                        const errorData = data as {
                            message?: string;
                            msg?: string;
                        };
                        errorMessage =
                            errorData.message ||
                            errorData.msg ||
                            "알 수 없는 오류";
                    }
                }
            }

            console.error("에러 메시지:", errorMessage);
            toast.error(`카카오 로그인 실패: ${errorMessage}`);
        },
    });
};

// 구글 로그인 훅 (useMutation) - 토큰을 파라미터로 받음
export const useGoogleLogin = () => {
    //쿠키 처리
    const { setUser } = useAuthStore();
    const router = useRouter();

    return useMutation({
        mutationFn: (idToken: string) => loginWithGoogle(idToken),
        onSuccess: (data, variables) => {
            // variables는 mutationFn에 전달된 파라미터 (idToken)
            if (!data.user) {
                toast.error("구글 로그인 실패: 사용자 정보 없음");
                return;
            }
            setUser(data.user);
            setCookie("authToken", `Firebase ${variables}`);
            // 사용자 정보를 localStorage에 저장
            localStorage.setItem("userData", JSON.stringify(data.user));
            toast.success("구글 로그인 성공!");
            router.push("/");
        },
        onError: (error) => {
            toast.error("구글 로그인 실패");
            console.error("구글 로그인 실패:", error);
        },
    });
};

// 로그아웃 훅 (useMutation)
export const useLogout = () => {
    //쿠키 처리
    const { clearUser } = useAuthStore();
    const router = useRouter();

    clearUser();
    // localStorage에서 사용자 정보 제거
    localStorage.removeItem("userData");
    toast.success("로그아웃 되었습니다");
    router.push("/auth/login");
};

// 현재 사용자 정보 조회 훅 (useQuery)
export const useCurrentUser = () => {
    const {
        data: user,
        isLoading: userLoading,
        error: userError,
        refetch: userRefetch,
    } = useQuery({
        queryKey: ["currentUser"],
        queryFn: async (): Promise<User> => {
            const response = await apiClient.get("/api/auth/me");
            return response.data;
        },
        retry: 1, // 인증 실패 시 재시도 줄임
        staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    });

    return { user, userLoading, userError, userRefetch };
};
