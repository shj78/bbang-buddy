// sentry.edge.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // 항상 활성화
    enabled: true,

    // 성능 모니터링 (10% 샘플링)
    tracesSampleRate: 0.1,

    // 에러 재생
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // 환경 설정
    environment: process.env.NODE_ENV,

    // 릴리즈 버전
    release: process.env.npm_package_version,
});
