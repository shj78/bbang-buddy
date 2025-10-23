import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ROUTES } from '../constants/routes';

export const useRequireAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  const isCheckAuth = () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요한 기능입니다.');
      router.push(ROUTES.AUTH.LOGIN);
      return false;
    }
    return true;
  };

  return { isCheckAuth };
};
