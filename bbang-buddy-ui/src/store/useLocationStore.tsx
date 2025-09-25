import { create } from "zustand";
import { LocationState } from "../types/location";

const useLocationStore = create<LocationState>((set, get) => ({
    //현재 위치
    currentLocation: { latitude: 37.5556, longitude: 126.9364 }, // 기본값: 신촌역
    //수동 내부 지정 또는 사용자 선택 위치
    manualLocation: null,
    //수동 사용자 선택 모드 여부
    isManualLocationMode: false,
    //현재 위치 가져오는 함수
    getCurrentLocation: () => {
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
                    console.info("위치 정보를 가져올 수 없습니다:", error);
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
            console.error("Geolocation을 지원하지 않는 브라우저입니다.");
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
    //수동 내부 지정 또는 사용자 선택 위치 설정하는 함수
    setManualLocation: (location) => {
        set({
            manualLocation: location,
            currentLocation: location,
        });
    },
    //수동 사용자 선택 모드 여부
    setManualLocationMode: (mode) => {
        set({ isManualLocationMode: mode });
    },
}));

export default useLocationStore;
