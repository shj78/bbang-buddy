'use client';

import { useEffect } from 'react';
import useNotification from '../../hooks/useNotification';
import { useAuthStore } from '../../store/useAuthStore';

const NotificationProvider = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { checkForNewNotifications } = useNotification();

  useEffect(() => {
    if (isAuthenticated) {
      checkForNewNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return null;
};

export default NotificationProvider;
