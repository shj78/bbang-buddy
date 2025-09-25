import { useState } from "react";
import { LoginRequest, SignupRequest } from "../types/auth";
import { EMAIL_REGEX } from "../constants/validation";

export const useFormValidation = () => {
    // 회원가입 관련 상태들
    const [userIdError, setUserIdError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [userIdChecking, setUserIdChecking] = useState(false);
    const [userIdAvailable, setUserIdAvailable] = useState<boolean | null>(
        null
    );

    // 로그인 폼 검증
    const validateLoginForm = (formData: LoginRequest): string | null => {
        if (!formData.userId || !formData.password) {
            return "아이디와 비밀번호를 입력해주세요.";
        }
        return null;
    };

    // 회원가입 폼 검증
    const validateSignupForm = (formData: SignupRequest): string | null => {
        if (
            !formData.userId ||
            !formData.password ||
            !formData.email ||
            !formData.username
        ) {
            return "모든 필드를 입력해주세요.";
        }

        if (userIdError || !userIdAvailable) {
            return "아이디를 확인해주세요.";
        }

        if (passwordError) {
            return "비밀번호를 확인해주세요.";
        }

        // 이메일 유효성 검증
        if (!EMAIL_REGEX.test(formData.email)) {
            return "올바른 이메일 형식을 입력해주세요.";
        }

        return null; // 검증 통과
    };

    // userId 중복 체크
    const checkUserIdAvailability = async (userId: string) => {
        if (userId.length < 4) {
            setUserIdError("아이디는 4자 이상이어야 합니다.");
            setUserIdAvailable(false);
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(userId)) {
            setUserIdError(
                "아이디는 영문, 숫자, 언더스코어만 사용 가능합니다."
            );
            setUserIdAvailable(false);
            return;
        }

        setUserIdChecking(true);
        setUserIdError(null);

        try {
            // 실제로는 API 호출: await apiClient.get(`/api/auth/check-userid/${userId}`)
            // 임시로 특정 아이디들을 이미 사용중으로 처리
            const unavailableIds = ["admin", "test", "user"];

            await new Promise((resolve) => setTimeout(resolve, 500)); // API 호출 시뮬레이션

            if (unavailableIds.includes(userId.toLowerCase())) {
                setUserIdError("이미 사용중인 아이디입니다.");
                setUserIdAvailable(false);
            } else {
                setUserIdError(null);
                setUserIdAvailable(true);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    "아이디 중복 확인 중 오류가 발생했습니다:",
                    error
                );
            }
            setUserIdError("아이디 중복 확인 중 오류가 발생했습니다.");
            setUserIdAvailable(false);
        } finally {
            setUserIdChecking(false);
        }
    };

    // 비밀번호 유효성 검증
    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return "비밀번호는 8자 이상이어야 합니다.";
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return "비밀번호에 소문자가 포함되어야 합니다.";
        }
        if (!/(?=.*\d)/.test(password)) {
            return "비밀번호에 숫자가 포함되어야 합니다.";
        }
        if (!/(?=.*[@$!%*?&])/.test(password)) {
            return "비밀번호에 특수문자(@$!%*?&)가 포함되어야 합니다.";
        }
        return null;
    };

    // 실시간 비밀번호 검증
    const handlePasswordChange = (password: string) => {
        const validation = validatePassword(password);
        setPasswordError(validation);
    };

    // 실시간 아이디 검증
    const handleUserIdChange = (userId: string) => {
        setUserIdAvailable(null);
        setUserIdError(null);
        // 디바운싱을 위한 타이머 (500ms 후 중복 체크)
        if (userId.trim()) {
            setTimeout(() => {
                checkUserIdAvailability(userId.trim());
            }, 500);
        }
    };

    return {
        validateLoginForm,
        validateSignupForm,
        validatePassword,
        checkUserIdAvailability,
        handlePasswordChange,
        handleUserIdChange,
        userIdError,
        passwordError,
        userIdChecking,
        userIdAvailable,
    };
};
