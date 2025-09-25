// 위치 정보 도메인 타입
export interface Location {
    latitude: number;
    longitude: number;
}

export interface LocationState {
    currentLocation: Location;
    manualLocation: Location | null;
    isManualLocationMode: boolean;
    getCurrentLocation: () => void;
    setManualLocation: (location: Location) => void;
    setManualLocationMode: (mode: boolean) => void;
}
