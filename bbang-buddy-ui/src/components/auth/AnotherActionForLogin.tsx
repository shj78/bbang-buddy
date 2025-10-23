import { Box, Link, Typography } from '@mui/material';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../constants/routes';

export default function ActionForLogin() {
  const router = useRouter();
  const handleForgotPassword = () => {
    toast.error(
      <>
        비밀번호 찾기 기능은 현재 지원하지 않습니다.
        <br />
        운영자에게 문의하세요.
      </>
    );
  };

  const handleGoToSignup = () => {
    router.push(ROUTES.AUTH.SIGNUP);
  };
  return (
    <Box sx={{ textAlign: 'center', color: 'black' }}>
      <Link
        component="button"
        type="button"
        variant="body2"
        onClick={handleForgotPassword}
        sx={{
          textDecoration: 'none',
          color: 'black',
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        비밀번호 찾기
      </Link>
      <Typography
        variant="body2"
        sx={{
          fontSize: '11px',
          mx: 1,
          color: '#666',
          display: 'inline-block',
        }}
      >
        |
      </Typography>
      <Link
        component="button"
        type="button"
        variant="body2"
        onClick={handleGoToSignup}
        sx={{
          textDecoration: 'none',
          color: 'black',
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        회원가입
      </Link>
    </Box>
  );
}
