'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import useLocationStore from '../../store/useLocationStore';

export default function AuthInitializer() {
  const { initializeAuth } = useAuthStore();
  const { getCurrentLocation } = useLocationStore();

  useEffect(() => {
    initializeAuth();
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
