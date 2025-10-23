import { useState } from 'react';
import { LoginRequest } from '../types/auth';

export const useFormValidation = () => {
  const [userIdAvailable, setUserIdAvailable] = useState<boolean | null>(null);

  const validateLoginForm = (formData: LoginRequest): string | null => {
    if (!formData.userId || !formData.password) {
      return '아이디와 비밀번호를 입력해주세요.';
    }
    return null;
  };

  const checkUserIdAvailability = async (userId: string) => {
    if (userId.length < 4) {
      setUserIdError('아이디는 4자 이상이어야 합니다.');
      setUserIdAvailable(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(userId)) {
      setUserIdError('아이디는 영문, 숫자, 언더스코어만 사용 가능합니다.');
      setUserIdAvailable(false);
      return;
    }

    setUserIdChecking(true);
    setUserIdError(null);

    try {
      // TODO: 실제로는 API 호출: await apiClient.get(`/api/auth/check-userid/${userId}`), 임시로 특정 아이디들을 이미 사용중으로 처리
      const unavailableIds = ['admin', 'test', 'user'];

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (unavailableIds.includes(userId.toLowerCase())) {
        setUserIdError('이미 사용중인 아이디입니다.');
        setUserIdAvailable(false);
      } else {
        setUserIdError(null);
        setUserIdAvailable(true);
      }
    } catch {
      setUserIdError('아이디 중복 확인 중 오류가 발생했습니다.');
      setUserIdAvailable(false);
    } finally {
      setUserIdChecking(false);
    }
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return '비밀번호에 소문자가 포함되어야 합니다.';
    }
    if (!/(?=.*\d)/.test(password)) {
      return '비밀번호에 숫자가 포함되어야 합니다.';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return '비밀번호에 특수문자(@$!%*?&)가 포함되어야 합니다.';
    }
    return null;
  };

  return {
    validateLoginForm,
    validatePassword,
    checkUserIdAvailability,
    userIdAvailable,
  };
};
