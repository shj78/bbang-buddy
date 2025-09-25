// 카카오 주소 검색 결과 타입
export interface KakaoAddressResult {
    y: string; // 위도
    x: string; // 경도
    address_name: string; // 지번 주소
    road_address?: {
        address_name: string; // 도로명 주소
    };
}

// 카카오 키워드 검색 결과 타입
export interface KakaoKeywordResult {
    y: string; // 위도
    x: string; // 경도
    place_name: string; // 장소명
    address_name: string; // 지번 주소
    road_address_name: string; // 도로명 주소
}
