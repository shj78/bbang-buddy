'use client';

import { useForm } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { SignupRequest } from '../../types/auth';
import { getBasicFieldStyles } from '../../styles/textFieldStyles';
import { useSignup } from '@/hooks/useAuth';
import { EMAIL_REGEX } from '@/constants/validation';
import { toast } from 'sonner';

export default function SignupForm() {
  const signupMutation = useSignup();
  const isPending = signupMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupRequest>({
    mode: 'onChange',
    defaultValues: {
      userId: '',
      password: '',
      email: '',
      username: '',
      roleId: 2,
      provider: 'local',
    },
  });

  const onSubmit = async (data: SignupRequest) => {
    try {
      await signupMutation.mutateAsync(data);
      reset();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      } else {
        toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
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
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          width: {
            xs: '100%',
            sm: '100%',
            md: '100%',
            lg: 480,
            xl: 480,
          },
          minHeight: 500,
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
          회원가입
        </Typography>

        <TextField
          {...register('userId', {
            required: '아이디를 입력해주세요.',
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: '영문, 숫자, 언더스코어만 사용 가능합니다.',
            },
            minLength: {
              value: 4,
              message: '아이디는 4자 이상이어야 합니다.',
            },
          })}
          label="아이디"
          type="text"
          error={!!errors.userId?.message}
          helperText={errors.userId?.message}
          sx={getBasicFieldStyles}
          disabled={isPending}
          required
          autoComplete="off"
        />

        <TextField
          label="사용자명"
          type="text"
          {...register('username', {
            required: '사용자명을 입력해주세요.',
            minLength: {
              value: 2,
              message: '사용자명은 2자 이상이어야 합니다.',
            },
          })}
          error={!!errors.username?.message}
          helperText={errors.username?.message}
          sx={getBasicFieldStyles}
          disabled={isPending}
          required
          autoComplete="name"
        />

        <TextField
          label="이메일"
          type="email"
          {...register('email', {
            required: '이메일을 입력해주세요.',
            pattern: {
              value: EMAIL_REGEX,
              message: '올바른 이메일 형식을 입력해주세요.',
            },
          })}
          error={!!errors.email?.message}
          helperText={errors.email?.message}
          sx={getBasicFieldStyles}
          disabled={isPending}
          required
          autoComplete="email"
        />

        <TextField
          label="비밀번호"
          type="password"
          {...register('password', {
            required: '비밀번호를 입력해주세요.',
            minLength: {
              value: 8,
              message: '비밀번호는 8자 이상이어야 합니다.',
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: '올바른 비밀번호 형식을 입력해주세요.',
            },
          })}
          error={!!errors.password?.message}
          helperText={errors.password?.message}
          sx={getBasicFieldStyles}
          disabled={isPending}
          required
          autoComplete="new-password"
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
            '회원가입'
          )}
        </Button>
      </Box>
    </Box>
  );
}
