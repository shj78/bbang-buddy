// 지오코딩 결과 타입 정의
export interface GeocodingResult {
    latitude: number;
    longitude: number;
    address: string;
}

// 지오코딩 성공 콜백 타입
export type GeocodingSuccessCallback = (result: GeocodingResult) => void;

// 지오코딩 에러 콜백 타입
export type GeocodingErrorCallback = (error: string) => void;

// 지오코딩 상태 변경 콜백 타입
export type GeocodingLoadingCallback = (isLoading: boolean) => void;
