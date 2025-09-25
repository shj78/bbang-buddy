export const getTextFieldStyles = (
    errorCondition?: boolean,
    successCondition?: boolean
) => ({
    mb: 3,
    "& .MuiOutlinedInput-root": {
        bgcolor: "#f6f6f6",
        "& fieldset": {
            border: errorCondition
                ? "2px solid #f44336"
                : successCondition
                  ? "2px solid #4caf50"
                  : "2px solid transparent",
            transition: "none",
        },
        "&:hover fieldset": {
            border: errorCondition
                ? "2px solid #f44336"
                : successCondition
                  ? "2px solid #4caf50"
                  : "2px solid transparent",
        },
        "&.Mui-focused fieldset": {
            border: errorCondition
                ? "2px solid #f44336"
                : successCondition
                  ? "2px solid #4caf50"
                  : "2px solid #7DD952",
        },
    },
    "& .MuiInputLabel-root": {
        color: "#909090",
        "&.Mui-focused": {
            color: errorCondition
                ? "#f44336"
                : successCondition
                  ? "#4caf50"
                  : "#7DD952",
        },
    },
});

export const getHelperTextStyles = (
    errorCondition?: boolean,
    successCondition?: boolean
) => ({
    "& .MuiFormHelperText-root": {
        color: errorCondition
            ? "#f44336"
            : successCondition
              ? "#4caf50"
              : "#666",
    },
});

// 아이디 필드 전용 스타일 (에러와 성공 상태 모두 고려)
export const getUserIdFieldStyles = (
    isUserIdError: boolean,
    isUserIdAvailable: boolean | null
) => ({
    ...getTextFieldStyles(isUserIdError, isUserIdAvailable === true),
    ...getHelperTextStyles(isUserIdError, isUserIdAvailable === true),
});

// 비밀번호 필드 전용 스타일 (에러와 성공 상태 고려)
export const getPasswordFieldStyles = (
    isPasswordError: boolean,
    password: string
) => ({
    ...getTextFieldStyles(isPasswordError, Boolean(password && !isPasswordError)),
    ...getHelperTextStyles(isPasswordError, false),
});

// 경계선 완전 제거 스타일 (PotDetailModal용)
export const getBorderlessFieldStyles = () => ({
    "& .MuiOutlinedInput-root": {
        bgcolor: "#f6f6f6",
        "& fieldset": {
            border: "none",
        },
        "&:hover fieldset": {
            border: "none",
        },
        "&.Mui-focused fieldset": {
            border: "none",
        },
        "&.Mui-disabled": {
            "& fieldset": {
                border: "none",
            },
        },
    },
    "& .MuiInputLabel-root": {
        color: "#909090",
        "&.Mui-focused": {
            color: "#7DD952",
        },
        "&.Mui-disabled": {
            color: "#333 !important",
        },
    },
    "& .MuiInputBase-input": {
        "&.Mui-disabled": {
            color: "#333 !important",
            WebkitTextFillColor: "#333 !important",
        },
    },
    // readOnly 상태에서 클릭 이벤트 막기
    "& .MuiInputBase-root": {
        "&[readonly]": {
            pointerEvents: "none",
        },
    },
});

// PotDetailModal용 읽기 전용 스타일 (클릭 이벤트 차단)
export const getReadOnlyFieldStyles = () => ({
    ...getBorderlessFieldStyles(),
    "& .MuiInputBase-root": {
        pointerEvents: "none",
    },
    "& .MuiInputLabel-root": {
        "&.Mui-disabled": {
            color: "#909090 !important",
        },
    },
    "& .MuiInputBase-input": {
        "&.Mui-disabled": {
            color: "#333 !important",
            WebkitTextFillColor: "#333 !important",
            fontSize: "14px!important",
        },
    },
});

// 기본 필드 스타일 (사용자명, 이메일)
export const getBasicFieldStyles = () => getTextFieldStyles();

// DateTimePicker 읽기 전용 스타일 (PotDetailModal용)
export const getReadOnlyDateTimePickerStyles = () => ({
    borderRadius: "6px",
    bgcolor: "#f6f6f6",
    pointerEvents: "none",
    "& .MuiOutlinedInput-root": {
        bgcolor: "#f6f6f6 !important",
        border: "none !important",
        borderRadius: "4px !important",
        "& fieldset": {
            display: "none !important",
        },
        "&:hover": {
            border: "none !important",
            "& fieldset": {
                display: "none !important",
            },
        },
        "&.Mui-focused": {
            border: "2px solid #7DD952 !important",
            "& fieldset": {
                display: "none !important",
            },
        },
        "&.Mui-disabled": {
            border: "none !important",
            "& fieldset": {
                display: "none !important",
            },
        },
    },
    "& fieldset": {
        display: "none !important",
    },
    "& .MuiOutlinedInput-notchedOutline": {
        display: "none !important",
    },
    "& .MuiInputLabel-root": {
        color: "#909090 !important",
        "&.Mui-focused": {
            color: "#7DD952 !important",
        },
    },
    "& .MuiInputBase-input": {
        color: "#333",
        padding: "16.5px 14px",
    },
    "& .MuiInputAdornment-root": {
        color: "#909090",
        display: "none !important",
    },
    "& .MuiButton-root": {
        display: "none !important",
    },
    "& .MuiIconButton-root": {
        display: "none !important",
    },
});
