import { useMutation } from '@tanstack/react-query';
import {
  signIn,
  signUp,
  loginWithGoogle,
  loginWithKakao,
} from '../lib/authApi';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { setCookie } from '../utils/cookieUtils';
import { ROUTES } from '../constants/routes';

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success('회원가입 성공! 로그인해주세요.');
      router.push(ROUTES.AUTH.LOGIN);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
        if (process.env.NODE_ENV === 'development') console.error(error);
      } else {
        toast.error('회원가입 실패');
        if (process.env.NODE_ENV === 'development') console.error(error);
      }
    },
  });
};

export const useLogin = () => {
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      setUser(data.user);
      setCookie('authToken', `Bearer ${data.jwtToken}`);
      localStorage.setItem('userData', JSON.stringify(data.user));
      toast.success('로그인 성공!');
      router.push(ROUTES.HOME);
    },
    onError: (error) => {
      toast.error('로그인 실패');
      if (process.env.NODE_ENV === 'development') console.error(error);
    },
  });
};

export const useKakaoLogin = () => {
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (accessToken: string) => loginWithKakao(accessToken),
    onSuccess: (data) => {
      if (!data.user) {
        toast.error('카카오 로그인 실패: 사용자 정보 없음');
        return;
      }
      setUser(data.user);
      setCookie('authToken', `Bearer ${data.jwtToken}`);
      localStorage.setItem('userData', JSON.stringify(data.user));

      toast.success('카카오 로그인 성공!');
      router.push(ROUTES.HOME);
    },
    onError: (error: unknown) => {
      let errorMessage = '카카오 로그인 실패';

      if (error instanceof Error && 'response' in error) {
        const response = (error as Error & { response: { data: unknown } })
          .response;
        if (response?.data) {
          const data = response.data;
          if (typeof data === 'string') {
            errorMessage = data;
          } else if (data && typeof data === 'object') {
            const errorData = data as {
              message?: string;
              msg?: string;
            };
            errorMessage =
              errorData.message || errorData.msg || '알 수 없는 오류';
          }
        }
      }
      toast.error(`카카오 로그인 실패: ${errorMessage}`);
    },
  });
};

export const useGoogleLogin = () => {
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (idToken: string) => loginWithGoogle(idToken),
    onSuccess: (data, variables) => {
      if (!data.user) {
        toast.error('구글 로그인 실패: 사용자 정보 없음');
        return;
      }
      setUser(data.user);
      setCookie('authToken', `Firebase ${variables}`);
      localStorage.setItem('userData', JSON.stringify(data.user));
      toast.success('구글 로그인 성공!');
      router.push(ROUTES.HOME);
    },
    onError: (error) => {
      toast.error(`구글 로그인 실패: ${error}`);
    },
  });
};

export const useLogout = () => {
  const { clearUser } = useAuthStore();
  const router = useRouter();

  clearUser();
  localStorage.removeItem('userData');
  toast.success('로그아웃 되었습니다');
  router.push(ROUTES.HOME);
};
