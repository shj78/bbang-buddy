export interface SignupRequest {
  userId: string;
  username: string;
  password: string;
  email: string;
  roleId: number;
  provider: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  userId: string;
  email: string;
  username: string;
  nickname?: string;
  userId?: string;
  createdAt: string;
  provider?: 'local' | 'kakao' | 'google';
}
