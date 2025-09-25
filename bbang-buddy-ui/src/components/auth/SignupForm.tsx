"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { SignupRequest } from "../../types/auth";
import { signUp } from "../../lib/authApi";
import { useFormValidation } from "../../hooks/useFormValidation";
import {
    getUserIdFieldStyles,
    getPasswordFieldStyles,
    getBasicFieldStyles,
} from "../../styles/textFieldStyles";
import { toast } from "sonner";

export default function SignupForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        validateSignupForm,
        handlePasswordChange,
        handleUserIdChange,
        userIdError,
        passwordError,
        userIdChecking,
        userIdAvailable,
    } = useFormValidation();

    const {
        register,
        handleSubmit: onSubmit,
        watch,
    } = useForm<SignupRequest>({
        defaultValues: {
            userId: "",
            password: "",
            email: "",
            username: "",
            roleId: 2,
            provider: "local",
        },
    });

    const handleSubmit = async (data: SignupRequest) => {
        setError(null);

        const errorMessage = validateSignupForm(data);

        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        setLoading(true);
        try {
            await signUp(data);
            toast.success("회원가입이 완료되었습니다.");
            router.push("/auth/login");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("회원가입 중 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
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
            {/* 회원가입 폼 박스 */}
            <Box
                component="form"
                onSubmit={onSubmit(handleSubmit)} //검증 통과하면 handleSubmit 실행, register 값으로 검증,
                sx={{
                    width: {
                        xs: "100%",
                        sm: "100%",
                        md: "100%",
                        lg: 480,
                        xl: 480,
                    },
                    minHeight: 500,
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
                    회원가입
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="아이디"
                    type="text"
                    {...register("userId", {
                        onChange: (e) => handleUserIdChange(e.target.value),
                    })}
                    // name="userId"
                    // onChange={handleInputChange}
                    // value={watch('userId} //이거 폼에 저장된 userId값으로 이미 설정됨...
                    required
                    error={!!userIdError}
                    helperText={
                        userIdChecking
                            ? "아이디 확인 중..."
                            : userIdError
                              ? userIdError
                              : userIdAvailable === true
                                ? "✓ 사용 가능한 아이디입니다."
                                : userIdAvailable === false
                                  ? ""
                                  : "영문, 숫자, 언더스코어 사용 가능 (4자 이상)"
                    }
                    sx={getUserIdFieldStyles(!!userIdError, userIdAvailable)}
                />

                <TextField
                    fullWidth
                    label="사용자명"
                    type="text"
                    {...register("username")}
                    required
                    sx={getBasicFieldStyles()}
                />

                <TextField
                    fullWidth
                    label="이메일"
                    type="email"
                    {...register("email")}
                    required
                    sx={getBasicFieldStyles()}
                />

                <TextField
                    fullWidth
                    label="비밀번호"
                    type="password"
                    {...register("password", {
                        onChange: (e) => handlePasswordChange(e.target.value),
                    })}
                    required
                    error={!!passwordError}
                    helperText={
                        passwordError
                            ? passwordError
                            : "8자 이상, 소문자, 숫자, 특수문자(@$!%*?&) 포함"
                    }
                    sx={getPasswordFieldStyles(
                        !!passwordError,
                        watch("password")
                    )}
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
                        "회원가입"
                    )}
                </Button>
            </Box>
        </Box>
    );
}
