import { useRef, useEffect, useState, useCallback } from "react";
import useLocationStore from "../store/useLocationStore";

export const useMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<NaverMap | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const { currentLocation, getCurrentLocation } = useLocationStore();
    const [currentLocationMarker, setCurrentLocationMarker] =
        useState<NaverMarker | null>(null);

    // 네이버 API 로딩 대기
    const waitForNaver = () => {
        return new Promise<void>((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 100; // 10초 제한

            const check = setInterval(() => {
                attempts++;
                if (window.naver && mapRef.current) {
                    clearInterval(check);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    clearInterval(check);
                    reject(new Error("API 로딩 타임아웃"));
                }
            }, 100);
        });
    };

    // 지도 생성
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
            setIsLoaded(true);
        } catch (error) {
            console.error("지도 생성 실패:", error);
            setIsLoaded(true);
        }
    }, [currentLocation]);

    // 지도 초기화
    useEffect(() => {
        waitForNaver()
            .then(() => {
                createMap();

                // 현재 위치가 없으면 가져오기
                if (!currentLocation) {
                    getCurrentLocation();
                }
            })
            .catch((error) => {
                console.error("지도 초기화 실패:", error);
                // 3초 후 재시도
                setTimeout(() => {
                    waitForNaver().then(() => {
                        createMap();
                    });
                }, 3000);
            });
    }, [currentLocation, getCurrentLocation, createMap]);

    // 현재 위치가 변경되면 지도 중심 이동
    useEffect(() => {
        if (map && currentLocation?.latitude && currentLocation?.longitude) {
            map.setCenter(
                new window.naver.maps.LatLng(
                    currentLocation.latitude,
                    currentLocation.longitude
                )
            );
        }
    }, [map, currentLocation?.latitude, currentLocation?.longitude]); // 🎯 shallowEqual 대신 개별 속성 추적

    return {
        mapRef,
        map,
        isLoaded,
        currentLocation,
        currentLocationMarker,
        setCurrentLocationMarker,
        createMap,
    };
};
