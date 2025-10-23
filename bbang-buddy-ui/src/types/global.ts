import { KakaoAddressResult, KakaoKeywordResult } from './kakao';

declare global {
  type NaverMap = InstanceType<typeof window.naver.maps.Map>;
  type NaverMarker = InstanceType<typeof window.naver.maps.Marker>;
  type NaverLatLng = InstanceType<typeof window.naver.maps.LatLng>;
  type NaverPoint = InstanceType<typeof window.naver.maps.Point>;

  interface Window {
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
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        services: {
          Geocoder: new () => {
            addressSearch: (
              query: string,
              callback: (result: KakaoAddressResult[], status: string) => void
            ) => void;
          };
          Places: new () => {
            keywordSearch: (
              query: string,
              callback: (result: KakaoKeywordResult[], status: string) => void
            ) => void;
          };
          Status: {
            OK: string;
          };
        };
      };
    };
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (options: {
          success: (authObj: { access_token: string }) => void;
          fail: (error: unknown) => void;
        }) => void;
      };
    };
  }
}
