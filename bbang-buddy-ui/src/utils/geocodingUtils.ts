// 🗺️ 카카오 지오코딩 유틸리티
import { FORM_CONSTANTS } from "../constants/formConstants";
import {
    GeocodingSuccessCallback,
    GeocodingErrorCallback,
    GeocodingLoadingCallback,
    GeocodingResult,
} from "../types/geocoding";
/**
 * 🔍 카카오 API를 사용한 주소 검색 및 좌표 변환
 * - 1차: 정확한 주소 검색 시도 (addressSearch)
 * - 2차: 키워드 기반 장소 검색 시도 (keywordSearch)
 * - 성공 시 위도/경도와 정확한 주소 반환
 *
 * @param address 검색할 주소 또는 장소명
 * @param onSuccess 성공 시 실행할 콜백
 * @param onError 에러 시 실행할 콜백
 * @param onLoadingChange 로딩 상태 변경 시 실행할 콜백
 */
export const searchAddressWithKakao = (
    address: string,
    onSuccess: GeocodingSuccessCallback,
    onError: GeocodingErrorCallback,
    onLoadingChange: GeocodingLoadingCallback
) => {
    // 입력값 검증
    if (!address.trim()) {
        onError(FORM_CONSTANTS.ERROR_MESSAGES.addressRequired);
        return;
    }

    onLoadingChange(true);

    // 카카오맵 API 로드 확인
    if (!window.kakao || !window.kakao.maps) {
        onError(FORM_CONSTANTS.ERROR_MESSAGES.kakaoApiNotLoaded);
        onLoadingChange(false);
        return;
    }

    // API 로드 후 검색 실행
    window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        const places = new window.kakao.maps.services.Places();

        // 1차: 주소 검색 시도
        geocoder.addressSearch(address, (addressResult, addressStatus) => {
            if (addressStatus === window.kakao.maps.services.Status.OK) {
                // ✅ 주소 검색 성공
                const coords = addressResult[0];
                const result: GeocodingResult = {
                    latitude: parseFloat(coords.y),
                    longitude: parseFloat(coords.x),
                    address:
                        coords.road_address?.address_name ||
                        coords.address_name,
                };

                onSuccess(result);
                onLoadingChange(false);
            } else {
                // 2차: 키워드 검색 시도
                places.keywordSearch(
                    address,
                    (keywordResult, keywordStatus) => {
                        onLoadingChange(false);

                        if (
                            keywordStatus ===
                                window.kakao.maps.services.Status.OK &&
                            keywordResult.length > 0
                        ) {
                            // ✅ 키워드 검색 성공
                            const place = keywordResult[0];
                            const baseAddress =
                                place.road_address_name || place.address_name;
                            const fullAddress = `${place.place_name} (${baseAddress})`;

                            const result: GeocodingResult = {
                                latitude: parseFloat(place.y),
                                longitude: parseFloat(place.x),
                                address: fullAddress,
                            };

                            onSuccess(result);
                        } else {
                            // ❌ 모든 검색 실패
                            onError(
                                FORM_CONSTANTS.ERROR_MESSAGES.addressNotFound
                            );
                        }
                    }
                );
            }
        });
    });
};

/**
 * 🔧 지오코딩 유틸리티 훅 (옵션)
 * - React 컴포넌트에서 쉽게 사용할 수 있도록 래핑
 * - 상태 관리가 필요한 경우 사용
 */
export const createGeocodingHandler = (
    onSuccess: GeocodingSuccessCallback,
    onError: GeocodingErrorCallback,
    onLoadingChange: GeocodingLoadingCallback
) => {
    return (address: string) => {
        searchAddressWithKakao(address, onSuccess, onError, onLoadingChange);
    };
};
