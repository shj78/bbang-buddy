import { create } from 'zustand';
import { getCookie, deleteCookie } from '../utils/cookieUtils';
import { User } from '../types/auth';
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (userData: User) => void;
  clearUser: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  setUser: (userData: User) => {
    set({ user: userData, isAuthenticated: true });
  },
  clearUser: () => {
    deleteCookie('authToken');
    deleteCookie('userData');
    set({ user: null, isAuthenticated: false });
  },
  initializeAuth: () => {
    const token = getCookie('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        set({
          user: parsedUser,
          isAuthenticated: true,
          isInitialized: true,
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('쿠키 파싱 오류:', error);
        }
        deleteCookie('authToken');
        localStorage.removeItem('userData');
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      }
    } else {
      set({ user: null, isAuthenticated: false, isInitialized: true });
    }
  },
}));
