import { COLORS } from "./colors";
import { FORM_CONSTANTS } from "../constants/formConstants";

// 🎨 공통 TextField 스타일
export const commonTextFieldStyles = {
    "& .MuiOutlinedInput-root": {
        bgcolor: COLORS.background,
        "& fieldset": {
            border: "2px solid transparent",
            transition: "none",
        },
        "&:hover fieldset": {
            border: "2px solid transparent",
        },
        "&.Mui-focused fieldset": {
            border: `2px solid ${COLORS.primary}`,
        },
    },
    "& .MuiInputLabel-root": {
        color: COLORS.textSecondary,
        "&.Mui-focused": {
            color: COLORS.primary,
        },
    },
};

// 🎨 DateTimePicker 스타일
export const dateTimePickerStyles = {
    borderRadius: "6px",
    bgcolor: COLORS.background,
    "& .MuiOutlinedInput-root": {
        bgcolor: `${COLORS.background} !important`,
        border: "none !important",
        borderRadius: "4px !important",
        "& fieldset": { display: "none !important" },
        "&:hover": {
            border: "none !important",
            "& fieldset": { display: "none !important" },
        },
        "&.Mui-focused": {
            border: `2px solid ${COLORS.primary} !important`,
            "& fieldset": { display: "none !important" },
        },
        "&.Mui-disabled": {
            border: "none !important",
            "& fieldset": { display: "none !important" },
        },
    },
    "& fieldset": { display: "none !important" },
    "& .MuiOutlinedInput-notchedOutline": { display: "none !important" },
    "& .MuiInputLabel-root": {
        color: `${COLORS.textSecondary} !important`,
        "&.Mui-focused": { color: `${COLORS.primary} !important` },
    },
    "& .MuiInputBase-input": {
        color: "#333",
        padding: "16.5px 14px",
    },
    "& .MuiInputAdornment-root": { color: COLORS.textSecondary },
};

// 🎨 DateTimePicker SlotProps (정적 객체)
export const dateTimePickerSlotProps = {
    textField: {
        fullWidth: true,
        variant: "outlined" as const,
        sx: dateTimePickerStyles,
    },
    actionBar: {
        sx: {
            "& .MuiButton-root": {
                color: "black !important",
            },
        },
    },
    day: {},
    digitalClockSectionItem: {
        sx: {
            "&.Mui-selected": {
                borderRadius: "10% !important",
            },
        },
    },
};

// 🎨 공통 버튼 스타일
export const buttonStyles = {
    // 취소 버튼 스타일
    cancel: {
        flex: 1,
        bgcolor: COLORS.background,
        color: COLORS.black,
        border: "none",
        "&:hover": {
            bgcolor: COLORS.background,
            color: COLORS.textSecondary,
        },
    },

    // 제출/확인 버튼 스타일
    submit: {
        flex: 1,
        bgcolor: COLORS.primary,
        color: COLORS.black,
    },

    // 이미지 업로드 버튼 스타일 (함수형)
    imageUpload: (imagePreview: string | null) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "160px",
        px: 2,
        bgcolor: COLORS.background,
        color: COLORS.textSecondary,
        border: "none",
        backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        overflow: "hidden",
        "&::before": imagePreview
            ? {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  zIndex: 1,
              }
            : {},
        "& .MuiButton-startIcon": {
            marginRight: "8px",
            marginLeft: 0,
            zIndex: 2,
            position: "relative",
        },
        "& .MuiButton-text": {
            zIndex: 2,
            position: "relative",
        },
    }),

    // 검색 버튼 스타일
    search: {
        "& .MuiButton-startIcon": {
            marginLeft: "0 !important",
            marginRight: "0 !important",
        },
    },
};

// 🎨 공통 모달 스타일
export const modalStyles = {
    container: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: FORM_CONSTANTS.MODAL_WIDTH,
        maxHeight: FORM_CONSTANTS.MODAL_MAX_HEIGHT,
        overflow: "auto",
        bgcolor: "background.paper",
        borderRadius: 4,
        boxShadow: 24,
        p: 4,
    },
};

// 🎨 공통 스택 스타일
export const stackStyles = {
    actionButtons: {
        direction: "row" as const,
        spacing: 2,
        sx: {
            width: "100%",
            height: FORM_CONSTANTS.BUTTON_HEIGHT,
        },
    },
};
