import { createTheme } from "@mui/material/styles";

// 빵버디 브랜드 컬러
const brandColors = {
    primary: {
        main: "#7DD952", // 메인컬러 (연두색)
        light: "#9AE66E", // 밝은 연두색
        dark: "#5CB03A", // 진한 연두색
    },
    secondary: {
        main: "#4CAF50", // 초록색 (신선함)
        light: "#81C784",
        dark: "#388E3C",
    },
    third: {
        main: "white",
    },
    background: {
        default: "#FFFFFF",
        paper: "#FFFFFF",
    },
};

// 빵버디 테마 생성
export const bbangBuddyTheme = createTheme({
    palette: {
        primary: brandColors.primary,
        secondary: brandColors.secondary,
        background: brandColors.background,
        text: {
            primary: "#333333",
            secondary: "#666666",
        },
    },

    typography: {
        fontFamily: ['"Noto Sans"', '"Noto Sans KR"'].join(","),

        h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#333333",
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 600,
            color: "#333333",
        },
        h3: {
            fontSize: "1.0rem",
            fontWeight: 400,
            color: "#000000",
        },
        h4: {
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#333333",
        },
        h5: {
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "#333333",
        },
        h6: {
            fontSize: "1.0rem",
            fontWeight: 400,
            color: "#000000",
        },
    },

    components: {
        // 버튼 커스터마이징
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: "none", // 대문자 변환 안함
                    fontWeight: 500,
                },
                contained: {
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                },
            },
        },
        // 카드 커스터마이징
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#F6F6F6",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                        transform: "translateY(-2px)",
                        transition: "all 0.2s ease-in-out",
                    },
                },
            },
        },

        // 칩(태그) 커스터마이징
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    fontWeight: 500,
                },
            },
        },
    },
});

export default bbangBuddyTheme;
