'use client';

import { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { toast } from 'sonner';
import { useLogin } from '../../hooks/useAuth';
import { LoginRequest } from '../../types/auth';
import { useFormValidation } from '../../hooks/useFormValidation';
import LoginInput from './LoginInput';
import AnotherActionForLogin from './AnotherActionForLogin';
import SocialLoginButton from './SocialLoginButton';

export default function LoginForm() {
  const loginMutation = useLogin();
  const { validateLoginForm } = useFormValidation();
  const [formData, setFormData] = useState<LoginRequest>({
    userId: '',
    password: '',
  });

  const isPending = loginMutation.isPending;

  const handleDefaultLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateLoginForm(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    loginMutation.mutate(formData);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 128px)',
          padding: '24px',
          position: 'relative',
          backgroundColor: 'white',
        }}
      >
        <Box
          component="form"
          onSubmit={handleDefaultLogin}
          noValidate
          sx={{
            width: {
              xs: 300,
              sm: 480,
              md: 480,
              lg: 480,
              xl: 480,
            },
            height: 429,
            display: 'flex',
            flexDirection: 'column',
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 4, textAlign: 'left', fontWeight: 'bold' }}
          >
            로그인
          </Typography>

          <LoginInput
            formData={formData}
            setFormData={setFormData}
            isPending={isPending}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isPending}
            sx={{
              height: 56,
              fontSize: '16px',
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            {isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              '로그인'
            )}
          </Button>

          <SocialLoginButton />

          <AnotherActionForLogin />
        </Box>
      </Box>
    </>
  );
}
