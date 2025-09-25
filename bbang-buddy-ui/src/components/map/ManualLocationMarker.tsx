import { useEffect } from "react";
import { MAP_MARKER_CURSOR_SVG } from "../../constants/image";

interface ManualLocationMarkerProps {
    map: NaverMap | null;
    mapRef: React.RefObject<HTMLDivElement | null>;
    currentLocationMarker: NaverMarker | null;
    isManualLocationMode: boolean;
    setManualLocationMode: (boolean: boolean) => void;
    setManualLocation: (location: {
        latitude: number;
        longitude: number;
    }) => void;
}

export default function ManualLocationMarker({
    map,
    mapRef,
    currentLocationMarker,
    isManualLocationMode,
    setManualLocationMode,
    setManualLocation,
}: ManualLocationMarkerProps) {
    // 내 위치 수동 지정 모드일 때
    useEffect(() => {
        if (!mapRef?.current) return;

        const mapContainer = mapRef.current;

        if (isManualLocationMode) {
            // 기존 초록색 마커
            const markerCursor = MAP_MARKER_CURSOR_SVG;

            // 지도 컨테이너와 모든 하위 요소에 커서 적용
            mapContainer.style.cursor = markerCursor;
            mapContainer.style.setProperty("cursor", markerCursor, "important");

            // 네이버 지도의 모든 하위 요소에도 커서 적용
            const allMapElements = mapContainer.querySelectorAll("*");
            allMapElements.forEach((element) => {
                const htmlElement = element as HTMLElement;
                htmlElement.style.cursor = markerCursor;
                htmlElement.style.setProperty(
                    "cursor",
                    markerCursor,
                    "important"
                );
            });
        } else {
            // 커서 복원
            mapContainer.style.cursor = "";
            mapContainer.style.removeProperty("cursor");

            // 모든 하위 요소의 커서도 복원
            const allMapElements = mapContainer.querySelectorAll("*");
            allMapElements.forEach((element) => {
                const htmlElement = element as HTMLElement;
                htmlElement.style.cursor = "";
                htmlElement.style.removeProperty("cursor");
            });
        }
    }, [isManualLocationMode, mapRef]);

    // 수동 지정으로 내 위치 클릭했을 때
    useEffect(() => {
        if (!map) return;

        const handleMapClick = (e: {
            coord: { lat: () => number; lng: () => number };
        }) => {
            if (isManualLocationMode) {
                const clickedLat = e.coord.lat();
                const clickedLng = e.coord.lng();

                // 기존 현재 위치 마커 제거
                if (currentLocationMarker) {
                    currentLocationMarker.setMap(null);
                }
                // 현재 위치 업데이트
                setManualLocation({
                    latitude: clickedLat,
                    longitude: clickedLng,
                });

                // 수동 모드 해제
                setManualLocationMode(false);

                // 지도 중심점 이동
                map.setCenter(
                    new window.naver.maps.LatLng(clickedLat, clickedLng)
                );
            }
        };

        // 이벤트 리스너 추가
        const listener = window.naver.maps.Event.addListener(
            map,
            "click",
            handleMapClick
        );

        // 클린업 함수
        return () => {
            if (listener) {
                window.naver.maps.Event.removeListener(listener);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, isManualLocationMode]);

    return null; // 마커는 지도에 직접 추가되므로 UI를 렌더링하지 않음
}
