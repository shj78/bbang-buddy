import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import QueryProvider from "../provider/QueryProvider";
import MuiProvider from "../provider/MuiProvider";
import { Noto_Sans_KR } from "next/font/google";
import Header from "../components/ui/Header";
import AuthInitializer from "../components/auth/AuthInitializer";
import KakaoInitializer from "../components/auth/KakaoInitializer";
import NotificationProvider from "../components/ui/NotificationProvider";
import { Toaster } from "sonner";
import { DEFAULT_ICON_IMAGE_PATH } from "../constants/image";

const notoSansKR = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    display: "swap",
    preload: true,
});

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NODE_ENV === "production"
            ? "https://bbangbuddy.com"
            : "http://localhost:8080"
    ),
    title: "BBangBuddy - 빵버디",
    description: "동네 사람들과 함께하는 공동구매 플랫폼",
    keywords: [
        "공동구매",
        "B마트",
        "할인",
        "N빵의 민족",
        "동네",
        "빵버디",
        "BBangBuddy",
    ],
    authors: [{ name: "Team BBangBuddy" }],
    openGraph: {
        title: "BBangBuddy - 빵버디",
        description: "동네 사람들과 함께하는 공동구매 플랫폼",
        url: "https://bbangbuddy.com",
        siteName: "BBangBuddy",
        images: [
            {
                url: DEFAULT_ICON_IMAGE_PATH, // 로고 이미지
                width: 1200,
                height: 630,
                alt: "BBangBuddy 로고",
            },
        ],
        locale: "ko_KR",
        type: "website",
    },

    icons: {
        icon: DEFAULT_ICON_IMAGE_PATH, // 파비콘
        apple: DEFAULT_ICON_IMAGE_PATH, // 애플 터치 아이콘
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ko">
            <body className={`${notoSansKR.className}`}>
                <QueryProvider>
                    <MuiProvider>
                        <AuthInitializer />
                        <KakaoInitializer />
                        <NotificationProvider />
                        <Header />
                        {children}
                        <Toaster />
                    </MuiProvider>
                </QueryProvider>
                <Script
                    src="https://developers.kakao.com/sdk/js/kakao.js"
                    strategy="beforeInteractive"
                />
                <Script
                    src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=saihurntip&submodules=geocoder"
                    strategy="beforeInteractive"
                />
                <Script
                    src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`}
                    strategy="beforeInteractive"
                />
            </body>
        </html>
    );
}
