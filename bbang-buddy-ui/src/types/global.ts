import { KakaoAddressResult, KakaoKeywordResult } from "./kakao";

// 지도 API 전역 타입 선언 (네이버 + 카카오)
declare global {
    // 네이버 지도 타입 별칭
    type NaverMap = InstanceType<typeof window.naver.maps.Map>;
    type NaverMarker = InstanceType<typeof window.naver.maps.Marker>;
    type NaverLatLng = InstanceType<typeof window.naver.maps.LatLng>;
    type NaverPoint = InstanceType<typeof window.naver.maps.Point>;

    interface Window {
        // 네이버 지도 API
        naver: {
            maps: {
                Map: new (
                    element: HTMLElement,
                    options: {
                        center: InstanceType<typeof window.naver.maps.LatLng>;
                        zoom: number;
                        zoomControl?: boolean;
                        mapDataControl?: boolean;
                        logoControl?: boolean;
                    }
                ) => {
                    setCenter: (
                        latLng: InstanceType<typeof window.naver.maps.LatLng>
                    ) => void;
                    setZoom: (zoom: number) => void;
                };
                Marker: new (options: {
                    position: InstanceType<typeof window.naver.maps.LatLng>;
                    map?: InstanceType<typeof window.naver.maps.Map>;
                    title?: string;
                    icon?: {
                        content: string;
                        anchor: InstanceType<typeof window.naver.maps.Point>;
                    };
                }) => {
                    setMap: (
                        map: InstanceType<typeof window.naver.maps.Map> | null
                    ) => void;
                };
                LatLng: new (
                    lat: number,
                    lng: number
                ) => {
                    lat: () => number;
                    lng: () => number;
                };
                Point: new (
                    x: number,
                    y: number
                ) => {
                    x: number;
                    y: number;
                };
                Event: {
                    addListener: (
                        instance:
                            | InstanceType<typeof window.naver.maps.Map>
                            | InstanceType<typeof window.naver.maps.Marker>,
                        eventName: string,
                        handler: (event: {
                            coord: { lat: () => number; lng: () => number };
                        }) => void
                    ) => unknown;
                    removeListener: (listener: unknown) => void;
                };
            };
        };
        // 카카오 지도 API
        kakao: {
            maps: {
                load: (callback: () => void) => void;
                services: {
                    Geocoder: new () => {
                        addressSearch: (
                            query: string,
                            callback: (
                                result: KakaoAddressResult[],
                                status: string
                            ) => void
                        ) => void;
                    };
                    Places: new () => {
                        keywordSearch: (
                            query: string,
                            callback: (
                                result: KakaoKeywordResult[],
                                status: string
                            ) => void
                        ) => void;
                    };
                    Status: {
                        OK: string;
                    };
                };
            };
        };
    }
}
