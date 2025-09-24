<p align="center">
  <img width="341" height="189" alt="bbd" src="https://github.com/user-attachments/assets/dc80f415-9bc0-4ce1-8b9a-d02644b4161a" />
</p>
<hr>

<h4 align="center">
  <a href="https://bbangbuddy.com">Home</a>
</h4>
<div align="center">
  <p>
    <a href="https://github.com/LazyVim/LazyVim/pulse">
      <img alt="Last commit" src="https://img.shields.io/github/last-commit/shj78/bbang-buddy?style=for-the-badge&logo=starship&color=8bd5ca&logoColor=D9E0EE&labelColor=302D41"/>
    </a>
    <a href="https://github.com/LazyVim/LazyVim/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/shj78/bbang-buddy?style=for-the-badge&logo=bilibili&color=F5E0DC&logoColor=D9E0EE&labelColor=302D41" />
    </a>
      <a href="https://github.com/LazyVim/LazyVim">
      <img alt="Repo Size" src="https://img.shields.io/github/repo-size/shj78/bbang-buddy?color=%23DDB6F2&label=SIZE&logo=codesandbox&style=for-the-badge&logoColor=D9E0EE&labelColor=302D41" />
    </a>
  </p>
</div>

# BBang Buddy
#### 부제: N빵의 민족

> **동네 사람들과 함께하는 위치 기반 공동구매 플랫폼**  
> 반경 3km 내 실시간 공동구매 팟을 탐색하고 참여할 수 있는 React 기반 웹 서비스


## 📖 프로젝트 개요

BBangBuddy는 지역 기반 N빵 구매 서비스로, <br>
사용자의 위치 중심 주변 3km 내 공동구매 팟을 실시간으로 탐색하고 참여할 수 있는 플랫폼입니다.  <br>
지도 기반 UI와 실시간 알림 시스템을 통해 직관적이고 편리한 분할구매 경험을 제공합니다.

## 📍 주요 기능

### 🗺️ **위치 기반 팟 탐색**
- 사용자 현재 위치 기반 반경 3km 내 팟 자동 필터링
- Naver Maps API를 활용한 지도 시각화 및 마커 클러스터링
- 실시간 거리 계산 및 주소 표시

### **실시간 알림 시스템**
- Server-Sent Events(SSE) 기반 실시간 참여/탈퇴 알림
- 연결 실패 시 자동 재연결 및 API 폴링 폴백 메커니즘
- 알림 읽음 처리 및 히스토리 관리

### **다중 로그인 지원**
- 일반 로그인/회원가입
- 카카오톡 소셜 로그인
- Firebase를 통한 구글 로그인
- JWT 토큰 기반 인증 및 자동 로그인 유지

### **지오코딩 서비스**
- Kakao Maps API 지오코딩 (주소 → 좌표)
- Naver Maps API 역지오코딩 (좌표 → 주소)
- 주소 검색 및 키워드 기반 장소 검색

## 🛠️ 기술 스택

### **Frontend**
- **Framework**: Next.js 15
- **Language**: TypeScript 
- **UI Library**: React 19
- **State Management**: 
  - Zustand 
  - TanStack Query 
- **Maps**: Naver Maps API, Kakao Maps API
- Alarm: SSE
- **Styling**: CSS Modules, Material-UI 

### **Infrastructure & Monitoring**
- **Error Tracking**: Sentry
- **Authentication**: Firebase, JWT
- **Deployment**: Oracle Cloud Infrastructure VM
- **Package Manager**: pnpm

### **Development Tools**
- **Linting**: ESLint
- **Date Handling**: date-fns, dayjs
- **HTTP Client**: Axios
- **Toast Notifications**: Sonner

## 🏗️ 아키텍처 설계

### **컴포넌트 아키텍처**
```
src/
├── app/                    # Next.js App Router 페이지
├── components/
│   ├── auth/              # 인증 관련 컴포넌트
│   ├── client/            # 클라이언트 컴포넌트 래퍼
│   ├── map/               # 지도 관련 컴포넌트
│   ├── pot/               # 팟 관련 컴포넌트
│   └── ui/                # 공통 UI 컴포넌트
├── hooks/                 # Custom Hook
├── store/                 # Zustand 전역 상태
├── lib/                   # API 클라이언트
├── utils/                 # 유틸리티 함수
└── types/                 # TypeScript 타입 정의
```

### **상태 관리 전략**
- **Zustand**: 클라이언트 상태 (인증, 위치, 알림)
- **TanStack Query**: 서버 상태 (팟 데이터, 사용자 정보)
- **쿠키**: JWT 토큰 저장 (자동 API 인증)
- **localStorage**: 사용자 정보 캐싱 (페이지 새로고침 대응)

## 📊 성과 및 최적화

### **성능 최적화**
- Next.js App Router 기반 파일 라우팅과 컴포넌트 분리로 페이지별 최적화된 번들링
- 지도·인증·알림 기능의 독립적 로딩을 통한 사용자 진입 경험 향상
- TanStack Query를 통한 API 캐싱·자동 갱신으로 서버 상태 동기화 및 실시간 알림 흐름 최적화

### **개발 경험 개선**
- Custom Hook을 통해 비즈니스 로직과 UI를 분리하고 컴포넌트 재사용성 극대화
- Zustand로 클라이언트 상태를 전역 관리하여 불필요한 리렌더링 최소화 및 UI 일관성 확보
- TypeScript 기반 타입 안전성 확보 및 개발 생산성 향상

### **사용자 경험**
- Geolocation API 기반 위치 자동 감지 및 수동 위치 설정 지원
- SSE 기반 실시간 알림으로 팟 참여/탈퇴 현황 즉시 반영
- Material-UI 기반 반응형 디자인으로 모바일/데스크톱 환경 최적화

**개발 기간**: 2025.06 - 2025.07  
**개발자**: 심혜진


## 🎯 향후 계획

- 서비스 내 채팅 기능
- 팟 카테고리 기능 추가 


## 📆 개발 기간
2025.06 ~ 2025.07 

