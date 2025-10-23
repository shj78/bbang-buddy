export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  PROFILE: {
    ROOT: '/profile',
  },
  SEARCH: {
    ROOT: '/search',
  },
  POT: {
    ROOT: '/pot',
    MY: '/pot/my',
  },
} as const;
