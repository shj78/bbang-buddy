"use client";

import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Google as GoogleIcon } from "@mui/icons-material";
import { toast } from "sonner";
import { useLogin } from "../../hooks/useAuth";
import { useKakaoLogin } from "../../hooks/useAuth";
import { useGoogleLogin } from "../../hooks/useAuth";
import { LoginRequest } from "../../types/auth";
import { getBasicFieldStyles } from "../../styles/textFieldStyles";
import { DEFAULT_KAKAO_IMAGE_PATH } from "../../constants/image";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../types/firebase";
import { useFormValidation } from "../../hooks/useFormValidation";

export default function LoginForm() {
    const [formData, setFormData] = useState<LoginRequest>({
        userId: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const loginMutation = useLogin();
    const kakaoLoginMutation = useKakaoLogin();
    const googleLoginMutation = useGoogleLogin();
    const { validateLoginForm } = useFormValidation();

    // 폼 입력 값 변경 시 상태 업데이트
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 스프링 시큐리티 기본 로그인
    const handleSubmitByDefault = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validationError = validateLoginForm(formData);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            loginMutation.mutate(formData);
        } catch (err) {
            console.error(err);
            setError("로그인 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 카카오톡 로그인
    const handleSubmitByKakao = async () => {
        setError(null);
        setLoading(true);

        try {
            if (!window.Kakao) {
                setError("카카오 SDK 로딩에 실패했습니다.");
                return;
            }
            window.Kakao.Auth.login({
                success: async (authObj: { access_token: string }) => {
                    try {
                        // 훅의 mutate 함수 사용
                        kakaoLoginMutation.mutate(authObj.access_token);
                    } catch (error: unknown) {
                        if (error instanceof Error) {
                            console.error("카카오톡 서버 인증 오류:", error);
                        }
                        setError("카카오톡 로그인 중 오류가 발생했습니다.");
                    }
                },
                fail: (error: unknown) => {
                    if (error instanceof Error) {
                        console.error("❌ 카카오 팝업창 로그인 실패:", error);
                    }
                    setError("카카오 팝업 오류가 발생했습니다.");
                },
            });
        } catch (error: unknown) {
            console.error("카카오톡 로그인 처리 오류:", error);
            setError("카카오톡 로그인 처리 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 구글 로그인
    const handleSubmitByGoogle = async () => {
        setError(null);
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            // 훅의 mutate 함수 사용
            googleLoginMutation.mutate(idToken);
        } catch (error: unknown) {
            console.error("구글 처리 오류:", error);
            setError("구글 처리 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        toast.error(
            <>
                비밀번호 찾기 기능은 현재 지원하지 않습니다.
                <br />
                운영자에게 문의하세요.
            </>
        );
    };

    const handleGoToSignup = () => {
        router.push("/auth/signup");
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "calc(100vh - 128px)",
                padding: "24px",
                position: "relative",
                backgroundColor: "white",
            }}
        >
            {/* 로그인 폼 박스 - 480*429 고정 */}
            <Box
                component="form"
                onSubmit={handleSubmitByDefault}
                sx={{
                    width: {
                        xs: 480, // 모바일 (0px+)
                        sm: 480, // 태블릿 (600px+) - 480px로 변경
                        md: 480, // 중간 (900px+)
                        lg: 480, // 데스크톱 (1200px+)
                        xl: 480, // 큰 화면 (1536px+)
                    },
                    height: 429,
                    display: "flex",
                    flexDirection: "column",
                    mb: 2,
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ mb: 4, textAlign: "left", fontWeight: "bold" }}
                >
                    로그인
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="아이디"
                    name="userId"
                    type="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    required
                    sx={getBasicFieldStyles()}
                />

                <TextField
                    fullWidth
                    label="비밀번호"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    sx={getBasicFieldStyles()}
                    disabled={loading}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                        height: 56,
                        fontSize: "16px",
                        fontWeight: "bold",
                        mb: 2,
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "로그인"
                    )}
                </Button>

                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={
                        <Image
                            src={DEFAULT_KAKAO_IMAGE_PATH}
                            alt="Kakao"
                            width={24}
                            height={24}
                            priority
                        />
                    }
                    sx={{
                        height: 56,
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        mb: 2,
                        bgcolor: "#FEE500",
                        border: "none",
                    }}
                    onClick={handleSubmitByKakao}
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "카카오톡으로 로그인"
                    )}
                </Button>

                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    sx={{
                        height: 56,
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        mb: 2,
                        border: "none",
                        bgcolor: "#F6F6F6",
                    }}
                    onClick={handleSubmitByGoogle}
                >
                    구글로 로그인
                </Button>

                <Box sx={{ textAlign: "center", color: "black" }}>
                    <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={handleForgotPassword}
                        sx={{
                            textDecoration: "none",
                            color: "black",
                            cursor: "pointer",
                            "&:hover": {
                                textDecoration: "underline",
                            },
                        }}
                    >
                        비밀번호 찾기
                    </Link>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "11px",
                            mx: 1,
                            color: "#666",
                            display: "inline-block",
                        }}
                    >
                        |
                    </Typography>
                    <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={handleGoToSignup}
                        sx={{
                            textDecoration: "none",
                            color: "black",
                            cursor: "pointer",
                            "&:hover": {
                                textDecoration: "underline",
                            },
                        }}
                    >
                        회원가입
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}
