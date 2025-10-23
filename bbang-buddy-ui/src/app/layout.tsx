import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '../provider/QueryProvider';
import MuiProvider from '../provider/MuiProvider';
import { Noto_Sans_KR } from 'next/font/google';
import Header from '../components/ui/Header';
import AuthInitializer from '../components/auth/AuthInitializer';
import NotificationProvider from '../components/ui/NotificationProvider';
import { Toaster } from 'sonner';
import { DEFAULT_ICON_IMAGE_PATH } from '../constants/image';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://bbangbuddy.com'
      : 'http://localhost:8080'
  ),
  title: 'BBangBuddy - 빵버디',
  description: '동네 사람들과 함께하는 공동구매 플랫폼',
  keywords: [
    '공동구매',
    'B마트',
    '할인',
    'N빵의 민족',
    '동네',
    '빵버디',
    'BBangBuddy',
  ],
  authors: [{ name: 'Team BBangBuddy' }],
  openGraph: {
    title: 'BBangBuddy - 빵버디',
    description: '동네 사람들과 함께하는 공동구매 플랫폼',
    url: 'https://bbangbuddy.com',
    siteName: 'BBangBuddy',
    images: [
      {
        url: DEFAULT_ICON_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: 'BBangBuddy 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  icons: {
    icon: DEFAULT_ICON_IMAGE_PATH,
    apple: DEFAULT_ICON_IMAGE_PATH,
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
            <NotificationProvider />
            <Header />
            {children}
            <Toaster />
          </MuiProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
