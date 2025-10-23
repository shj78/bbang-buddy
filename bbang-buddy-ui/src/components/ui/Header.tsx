'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
} from '@mui/material';
import Search from './Search';
import NotificationBotton from './NotificationBotton';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { DEFAULT_PROFILE_IMAGE_PATH } from '../../constants/image';
import { useAuthStore } from '../../store/useAuthStore';
import { Suspense } from 'react';
import { ROUTES } from '../../constants/routes';
import { useRequireAuth } from '../../hooks/useRequireAuth';

export default function Header() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { isCheckAuth } = useRequireAuth();

  const handleMyPotClick = (e: React.MouseEvent) => {
    if (!isCheckAuth()) {
      e.preventDefault();
    }
  };

  const moveToProfile = () => {
    router.push(ROUTES.PROFILE.ROOT);
  };

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar
        sx={{
          backgroundColor: 'white',
          paddingLeft: {
            xs: '20px',
            sm: '30px',
            md: '40px',
            lg: '40px',
            xl: '40px',
          },
          paddingRight: {
            xs: '20px',
            sm: '30px',
            md: '40px',
            lg: '40px',
            xl: '40px',
          },
          maxWidth: '100%',
          overflow: 'hidden',
          justifyContent: 'space-between',
          gap: {
            xs: '0px',
            sm: '0px',
            md: '35px',
            lg: '337px',
            xl: '337px',
          },
        }}
      >
        {/* 로고 + 사이트 이름 + 좌측 메뉴*/}
        <Box
          sx={{
            padding: '34px 0px',
            minHeight: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            marginRight: '40px',
            flexShrink: 0,
            justifyContent: 'flex-start',
          }}
        >
          {/* 로고 + 브랜드명 */}
          <Link
            href={ROUTES.HOME}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <Image
                  src="/icon.png"
                  alt="BBangBuddy 로고"
                  width={20}
                  height={20}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 900,
                  color: '#7DD952',
                  fontSize: 'clamp(20px, 1.77vw, 20px)',
                  '@media (max-width: 835px)': {
                    display: 'none',
                  },
                }}
              >
                N빵의·민족
              </Typography>
            </Box>
          </Link>

          {/* 메뉴 버튼들 */}
          {/* Next Link에서 onClick먼저 호출되고 정상이면 href */}
          <Link href={ROUTES.POT.MY}>
            <Button
              onClick={handleMyPotClick}
              sx={{
                color: pathname === ROUTES.POT.MY ? 'black' : '#909090',
                fontSize: '16px',
                '&.MuiButton-root:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              나의 팟
            </Button>
          </Link>
          <Link href={ROUTES.POT.ROOT}>
            <Button
              sx={{
                color: pathname === ROUTES.POT.ROOT ? 'black' : '#909090',
                fontSize: '16px',
                '&.MuiButton-root:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              모든 팟
            </Button>
          </Link>
        </Box>
        {/* 우측 메뉴 버튼들 */}
        {!isInitialized ? (
          <></>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 'auto',
              flexShrink: 0,
              '@media (max-width: 570px)': {
                display: 'none',
              },
            }}
          >
            <Suspense>
              <Search />
            </Suspense>
            {/* 로그인 상태에 따른 조건부 렌더링 */}
            {isAuthenticated ? (
              <Box
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'none',
                    md: 'flex',
                    lg: 'flex',
                    xl: 'flex',
                  },
                  '@media (min-width: 730px)': {
                    display: 'flex',
                  },
                  gap: '16px',
                }}
              >
                {/* 로그인된 상태: 알림 + 프로필 */}
                <Box
                  sx={{
                    paddingLeft: '16px',
                  }}
                >
                  <NotificationBotton></NotificationBotton>
                </Box>
                <IconButton sx={{ padding: 0 }} onClick={moveToProfile}>
                  <Avatar
                    src={DEFAULT_PROFILE_IMAGE_PATH}
                    sx={{
                      width: 56,
                      height: 56,
                      cursor: 'pointer',
                    }}
                  >
                    U
                  </Avatar>
                </IconButton>
              </Box>
            ) : (
              /* 로그인 안된 상태: 로그인 버튼 */
              <>
                <Link href={ROUTES.AUTH.LOGIN}>
                  <Box
                    sx={{
                      display: {
                        xs: 'none',
                        sm: 'none',
                        md: 'flex',
                        lg: 'flex',
                        xl: 'flex',
                      },
                      '@media (min-width: 730px)': {
                        display: 'flex',
                      },
                      paddingLeft: '16px',
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        width: 90,
                        height: 56,
                        backgroundColor: '#7DD952',
                        color: 'black',
                        fontSize: '14px',
                        padding: '8px 16px',
                        '&:hover': {
                          backgroundColor: '#6BC742',
                        },
                      }}
                    >
                      로그인
                    </Button>
                  </Box>
                </Link>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
