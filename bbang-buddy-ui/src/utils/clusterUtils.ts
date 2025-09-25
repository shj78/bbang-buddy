import { Pot } from "../types/pot";

// 클러스터링을 위한 유틸리티 함수들
export const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const createClusterIcon = (count: number) => {
    // 검정색으로 통일
    const baseColor = "#333333";

    return `
        <div style="
            position: relative;
            width: 40px;
            height: 40px;
            background: ${baseColor};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">
            ${count}
        </div>
    `;
};

// 마커 클러스터링 함수
export const clusterMarkers = (pots: Pot[], clusterRadius: number = 0.01) => {
    const clusters: { center: { lat: number; lng: number }; pots: Pot[] }[] =
        [];

    pots.forEach((pot) => {
        if (!pot.latitude || !pot.longitude) return;

        let isAdded = false;

        // 기존 클러스터에 추가할 수 있는지 확인
        for (const cluster of clusters) {
            const distance = calculateDistance(
                cluster.center.lat,
                cluster.center.lng,
                pot.latitude,
                pot.longitude
            );

            if (distance <= clusterRadius) {
                cluster.pots.push(pot);
                // 클러스터 중심점 업데이트
                cluster.center.lat =
                    cluster.pots.reduce((sum, p) => sum + p.latitude!, 0) /
                    cluster.pots.length;
                cluster.center.lng =
                    cluster.pots.reduce((sum, p) => sum + p.longitude!, 0) /
                    cluster.pots.length;
                isAdded = true;
                break;
            }
        }

        // 새로운 클러스터 생성
        if (!isAdded) {
            clusters.push({
                center: { lat: pot.latitude, lng: pot.longitude },
                pots: [pot],
            });
        }
    });

    return clusters;
};
