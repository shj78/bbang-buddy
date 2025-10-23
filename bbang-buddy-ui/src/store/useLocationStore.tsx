import { create } from 'zustand';
import { LocationState } from '../types/location';
import { isBrowser } from '@/utils/typeUtils';

const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: { latitude: 37.5556, longitude: 126.9364 }, // 기본값: 신촌역
  manualLocation: null,
  isManualLocationMode: false,
  getCurrentLocation: () => {
    if (!isBrowser()) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          set({
            currentLocation: {
              latitude: latitude,
              longitude: longitude,
            },
          });
        },
        (error) => {
          if (process.env.NODE_ENV === 'development') {
            console.info('위치 정보를 가져올 수 없습니다:', error);
          }
          const { manualLocation } = get();
          if (manualLocation) {
            set({ currentLocation: manualLocation });
          } else {
            set({
              currentLocation: {
                latitude: 37.5556,
                longitude: 126.9364,
              },
            });
          }
        }
      );
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.error('Geolocation을 지원하지 않는 브라우저입니다.');
      }
      const { manualLocation } = get();
      if (manualLocation) {
        set({ currentLocation: manualLocation });
      } else {
        set({
          currentLocation: { latitude: 37.5556, longitude: 126.9364 },
        });
      }
    }
  },
  setManualLocation: (location) => {
    set({
      manualLocation: location,
      currentLocation: location,
    });
  },
  setManualLocationMode: (mode) => {
    set({ isManualLocationMode: mode });
  },
}));

export default useLocationStore;
