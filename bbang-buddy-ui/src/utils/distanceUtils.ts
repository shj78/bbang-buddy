/**
 * 두 좌표 간의 거리를 km 단위로 계산
 * @param lat1 첫 번째 위도
 * @param lng1 첫 번째 경도
 * @param lat2 두 번째 위도
 * @param lng2 두 번째 경도
 * @returns 거리 (km)
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * 두 좌표 간의 거리를 m 또는 km 단위로 포맷팅
 * @param latitude 대상 위도
 * @param longitude 대상 경도
 * @param currentLat 기준 위도
 * @param currentLng 기준 경도
 * @returns 거리 문자열 (예: '500m', '1.2km', '거리 정보 없음')
 */
export function formatDistance(
    latitude: number | undefined,
    longitude: number | undefined,
    currentLat: number,
    currentLng: number
): string {
    if (latitude === undefined || longitude === undefined) {
        return "거리 정보 없음";
    }
    const distanceKm = calculateDistance(
        currentLat,
        currentLng,
        latitude,
        longitude
    );
    const distanceM = distanceKm * 1000;
    if (distanceM < 1000) {
        return `${Math.round(distanceM)}m`;
    } else {
        return `${distanceKm.toFixed(1)}km`;
    }
}
