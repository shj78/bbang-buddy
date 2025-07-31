<p align="center">
  <img width="341" height="189" alt="bbd" src="https://github.com/user-attachments/assets/dc80f415-9bc0-4ce1-8b9a-d02644b4161a" />
</p>
<hr>

<h4 align="center">
  <a href="https://bbang-buddy.com">Home</a>
  ·
  <a href="https://bbang-buddy.github.io">Docs</a>
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

## 🍞 N빵의 민족

지역 기반 공동 구매 N빵 플랫폼

## 📌 프로젝트 개요

지역 주민들이 함께 구매하고 나누는 'N빵' 문화를 위한 플랫폼입니다. <br>
같이 사면 더 저렴하고 나누면 따뜻한 서비스를 지향합니다.

## 💡 기획 의도
주거 공간에 비해 생필품이 쌓이거나 구매의 기본 단위가 커서 곤란했던 적이 많았습니다. <br>
결국 버리는 일이 많아져 낭비를 줄일 수 있는 방법을 고민하게 되었습니다. 

100원 단위나 극소량으로도 물건을 구매하고 판매하는 시대에, 'N빵' 구매나 나눔도 충분히 가능하겠다고 생각했습니다. <br>
특히 1인 가구의 삶을 개선하고자 지역 주민들과 커뮤니티 기반 소비 경험을 할 수 있다면 좋겠다는 니즈로 만든 서비스입니다.

## ❗️용어
- 팟(BBANG POT) : 빵팟이라고도 불리며, 공동 구매 게시글 또는 공동 구매 그룹과 같은 역할
- 빵버디(BBANG BUDDY) : N빵의 민족을 이용하는 사용자

## 🛠 기술 스택
| 구분 | 기술 |
|------|------|
| **Frontend** | React.js, Next.js, React Query, Zustand, MUI |
| **Backend** | Spring Boot, Firebase Auth, Kakao API, SSE |
| **Database** | Oracle (prod), H2 (dev) |
| **CI/CD** | Oracle VM (배포 예정), Nginx |
| **지도 API** | Naver Map, Kakao Map |


## 🖌️ 주요 기능

#### 🔐 인증

- Firebase + Kakao 소셜 로그인 + Spring Security 연동

- JWT 토큰 기반 인증

- 회원가입 / 탈퇴 기능

#### 📦 팟 관리

- 팟 생성 / 목록 조회 / 상세 보기 / 삭제 / 수정

- 위치 기반 3km내 팟 필터링 

- 참여 / 퇴장 기능
  
- 정원 초과 시 마감 처리

#### 🔔 알림

- SSE(Server-Sent Events) 기반 실시간 알림

- 새로운 팟 생성 시 유저에게 알림 전송

- 읽음/미확인 필터링 기능

#### 🗺 지도 연동

- 네이버 지도 연동 (팟 위치 시각화)

#### 🖼 이미지 업로드

- 팟 생성 시 이미지 등록 (파일 시스템 기반)

## 🎯 향후 계획

- 서비스 내 채팅 기능
- 팟 카테고리 기능 추가 

## 👩‍💻 개발자

| 이름 | 역할 |
| --- | --- |
| 심혜진 | 기획, 프론트엔드, 백엔드, 인프라 전체 |

## 📆 개발 기간
2025.06 ~ 2025.07 

