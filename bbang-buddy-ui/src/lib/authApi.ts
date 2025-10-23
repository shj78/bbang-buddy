import apiClient from './apiClient';
import { LoginRequest, SignupRequest } from '../types/auth';

export const signUp = async (signUpRequest: SignupRequest) => {
  const response = await apiClient.post('/api/auth/signup', signUpRequest);
  return response.data;
};

export const signIn = async (loginRequest: LoginRequest) => {
  const response = await apiClient.post('/api/auth/login', loginRequest);
  return response.data;
};

export const loginWithGoogle = async (token: string) => {
  const response = await apiClient.post('/api/auth/firebase/google', {
    idToken: token,
  });
  return response.data;
};

export const loginWithKakao = async (token: string) => {
  const response = await apiClient.post(
    '/api/auth/kakao',
    { token },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};
