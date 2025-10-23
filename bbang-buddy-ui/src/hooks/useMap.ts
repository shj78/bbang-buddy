import { useRef, useEffect, useState, useCallback } from 'react';
import useLocationStore from '../store/useLocationStore';
import { toast } from 'sonner';

export const useMap = (scriptLoaded: boolean) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<NaverMap | null>(null);
  const { currentLocation, getCurrentLocation } = useLocationStore();
  const [currentLocationMarker, setCurrentLocationMarker] =
    useState<NaverMarker | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 5;

  const waitForMapSDKLoaded = () => {
    return new Promise<void>((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 100;

      const check = setInterval(() => {
        attempts++;
        if (window.naver && mapRef.current) {
          clearInterval(check);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(check);
          reject(new Error('API 로딩 타임아웃'));
        }
      }, 100);
    });
  };

  const createMap = useCallback(() => {
    try {
      if (!mapRef.current) return;

      const lat = currentLocation?.latitude || 37.5556;
      const lng = currentLocation?.longitude || 126.9364;

      const newMap = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(lat, lng),
        zoom: 14,
        zoomControl: true,
        mapDataControl: false,
        logoControl: false,
      });

      setMap(newMap);
      setIsMapLoaded(true);
    } catch {
      setIsMapLoaded(true);
    }
  }, [currentLocation]);

  const initializeMap = async () => {
    try {
      await waitForMapSDKLoaded();
      createMap();

      if (!currentLocation) {
        getCurrentLocation();
      }
    } catch {
      toast.error('지도 로딩중 오류가 발생했습니다.');
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          initializeMap();
        }, 3000);
      }
    }
  };
  useEffect(() => {
    if (scriptLoaded) {
      initializeMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded]);

  useEffect(() => {
    if (map && currentLocation?.latitude && currentLocation?.longitude) {
      map.setCenter(
        new window.naver.maps.LatLng(
          currentLocation.latitude,
          currentLocation.longitude
        )
      );
    }
  }, [map, currentLocation?.latitude, currentLocation?.longitude]);
  return {
    mapRef,
    map,
    isMapLoaded,
    currentLocation,
    currentLocationMarker,
    setCurrentLocationMarker,
    createMap,
  };
};
