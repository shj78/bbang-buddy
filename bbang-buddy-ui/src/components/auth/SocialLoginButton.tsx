import { Button, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { DEFAULT_KAKAO_IMAGE_PATH } from '../../constants/image';
import { useKakaoLogin } from '../../hooks/useAuth';
import { useGoogleLogin } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../types/firebase';
import Script from 'next/script';
import { Google as GoogleIcon } from '@mui/icons-material';

export default function SocialLoginButton() {
  const kakaoLoginMutation = useKakaoLogin();
  const googleLoginMutation = useGoogleLogin();
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY || '';

  const isPending =
    kakaoLoginMutation.isPending || googleLoginMutation.isPending;

  const handleKakaoScriptLoad = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
    }
  };
  const handleKakaoLogin = async () => {
    if (!window.Kakao) {
      toast.error('카카오 SDK 로딩에 실패했습니다.');
      return;
    }

    window.Kakao.Auth.login({
      success: async (authObj: { access_token: string }) => {
        kakaoLoginMutation.mutate(authObj.access_token);
      },
      fail: (error: unknown) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ 카카오 팝업창 로그인 실패:', error);
        }
        toast.error('카카오 팝업 오류가 발생했습니다.');
      },
    });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      googleLoginMutation.mutate(idToken);
    } catch {
      toast.error('구글 처리 중 오류가 발생했습니다.');
    }
  };
  return (
    <>
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="afterInteractive"
        id="kakao-sdk-script"
        onLoad={handleKakaoScriptLoad}
      />
      <Button
        variant="outlined"
        fullWidth
        startIcon={
          <Image
            src={DEFAULT_KAKAO_IMAGE_PATH}
            alt="Kakao"
            width={24}
            height={24}
            priority
          />
        }
        sx={{
          height: 56,
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'black',
          mb: 2,
          bgcolor: '#FEE500',
          border: 'none',
        }}
        onClick={handleKakaoLogin}
        disabled={isPending}
      >
        {isPending ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          '카카오톡으로 로그인'
        )}
      </Button>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<GoogleIcon />}
        sx={{
          height: 56,
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'black',
          mb: 2,
          border: 'none',
          bgcolor: '#F6F6F6',
        }}
        onClick={handleGoogleLogin}
      >
        구글로 로그인
      </Button>
    </>
  );
}
