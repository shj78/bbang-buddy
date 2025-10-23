'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { Box, Typography, Button, Divider } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Image from 'next/image';
import { DEFAULT_PROFILE_IMAGE_PATH } from '../../constants/image';
import { useState } from 'react';
import Question from './Question';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ROUTES } from '../../constants/routes';

//!이 컴포넌트만 오면 엄청 느려지는 문제가 있음
export default function Profile() {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const user = useAuthStore((state) => state.user);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const handleChangePassword = () => {
    toast.error(
      <>
        비밀번호 변경 기능은 현재 지원하지 않습니다.
        <br />
        문의하기로 요청해주세요.
      </>
    );
  };

  const handleChangeEmail = () => {
    toast.error(
      <>
        이메일 변경 기능은 현재 지원하지 않습니다.
        <br />
        문의하기로 요청해주세요.
      </>
    );
  };

  const handleLogout = () => {
    clearUser();
    router.push(ROUTES.HOME);
    queryClient.clear();
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: 'calc(100vh - 128px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <Box
        sx={{
          width: { xs: '90vw', sm: '480px' },
          maxWidth: '480px',
          height: 'auto',
          minHeight: { xs: '500px', sm: '593px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          padding: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ width: '100%', alignItems: 'left', marginBottom: 5 }}
        >
          내 프로필
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: '88px',
            padding: 2,
            backgroundColor: '#f6f6f6',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            marginBottom: 5,
          }}
        >
          <Image
            src={DEFAULT_PROFILE_IMAGE_PATH}
            alt="프로필 이미지"
            width={50}
            height={50}
          />
          <Typography sx={{ alignItems: 'left' }}>
            {user?.nickname ? user.nickname : user?.username}
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Button
            variant="contained"
            sx={{
              color: 'black',
              borderRadius: '6px',
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#d0d0d0' },
            }}
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </Box>

        <Typography
          variant="h5"
          sx={{
            width: '100%',
            alignItems: 'left',
            alignSelf: 'flex-start',
            marginBottom: 2,
          }}
        >
          계정 정보
        </Typography>
        <Box
          sx={{
            width: '100%',
            alignSelf: 'flex-start',
            marginBottom: 2,
          }}
        >
          <Typography
            sx={{
              width: '100%',
              alignItems: 'left',
              marginBottom: 0.5,
              fontWeight: 'medium',
            }}
          >
            이메일
          </Typography>
          <Typography
            sx={{
              width: '100%',
              alignItems: 'left',
              color: '#909090',
              fontSize: '14px',
            }}
          >
            {user?.email}
          </Typography>
          <Divider sx={{ width: '100%', marginY: 2 }} />
          <Typography
            sx={{
              width: '100%',
              alignItems: 'left',
              marginBottom: 0.5,
              fontWeight: 'medium',
            }}
          >
            계정 생성 날짜
          </Typography>
          <Typography
            sx={{
              width: '100%',
              alignItems: 'left',
              color: '#909090',
              fontSize: '14px',
            }}
          >
            {new Date(user?.createdAt || '').toLocaleDateString()}
          </Typography>
        </Box>
        {user?.provider == 'local' && (
          <>
            <Typography
              variant="h5"
              sx={{
                width: '100%',
                alignItems: 'left',
                alignSelf: 'flex-start',
                marginBottom: 2,
              }}
            >
              설정
            </Typography>
            <Box sx={{ width: '100%', alignSelf: 'flex-start' }}>
              <Button
                sx={{
                  padding: 0,
                  width: '100%',
                  justifyContent: 'space-between',
                  marginBottom: 0.5,
                  fontWeight: 'medium',
                  color: 'black',
                }}
                onClick={handleChangePassword}
              >
                비밀번호 변경하기
                <ChevronRightIcon />
              </Button>
              <Divider sx={{ width: '100%', marginY: 2 }} />
              <Button
                sx={{
                  padding: 0,
                  width: '100%',
                  justifyContent: 'space-between',
                  color: 'black',
                  fontWeight: 'medium',
                  backgroundColor: 'white',
                }}
                onClick={handleChangeEmail}
              >
                이메일 변경하기
                <ChevronRightIcon />
              </Button>
            </Box>
          </>
        )}
        <Box sx={{ width: '100%', alignSelf: 'flex-start' }}>
          <Button
            onClick={() => setModalOpen(true)}
            sx={{
              padding: 0,
              width: '100%',
              justifyContent: 'space-between',
              color: 'black',
              fontWeight: 'medium',
              backgroundColor: 'white',
            }}
          >
            문의하기
            <ChevronRightIcon />
          </Button>
        </Box>
        <Question open={modalOpen} onClose={handleModalClose} />
      </Box>
    </div>
  );
}
