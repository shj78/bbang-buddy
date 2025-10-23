export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
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

export function formatDistance(
  latitude: number | undefined,
  longitude: number | undefined,
  currentLat: number,
  currentLng: number
): string {
  if (latitude === undefined || longitude === undefined) {
    return '거리 정보 없음';
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
