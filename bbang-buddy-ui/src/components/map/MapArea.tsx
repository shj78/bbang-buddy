import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { useMap } from "../../hooks/useMap";
import { useNearPots } from "../../hooks/usePots";
import useLocationStore from "../../store/useLocationStore";
import PotMarkerPopup from "../pot/PotMarkerPopup";
import ManualLocationMarker from "./ManualLocationMarker";
import MapSkeleton from "./MapSkeleton";
import { Pot } from "../../types/pot";

//성능최적화를 위한 지도 관련 컴포넌트 지연로딩, 효과 거의 없음
const NaverMap = lazy(() => import("./NaverMap"));
const PotMarkerMaker = lazy(() => import("./PotMarkerMaker"));
const CurrentLocationMarker = lazy(() => import("./CurrentLocationMarker"));
const ManualLocationButton = lazy(() => import("./ManualLocationButton"));

export default function MapArea() {
    // useState
    const [selectedPot, setSelectedPot] = useState<Pot | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);

    // hook
    const {
        mapRef, // 지도 참조
        isLoaded, // 지도 로딩 상태
        map, // 지도 객체
        currentLocation, // 현재 위치
        currentLocationMarker, // 현재 위치 마커
        setCurrentLocationMarker, // 현재 위치 마커 설정
    } = useMap();

    // 현재 위치 3km 반경 팟
    const location = useMemo(
        () => ({
            latitude: currentLocation?.latitude || 0,
            longitude: currentLocation?.longitude || 0,
        }),
        [currentLocation?.latitude, currentLocation?.longitude]
    );

    const { pots } = useNearPots(location);

    // store
    const {
        isManualLocationMode, // 수동 위치 모드
        setManualLocationMode, // 수동 위치 모드 설정
        setManualLocation, // 수동 위치 설정
    } = useLocationStore();

    // 모달 닫기 핸들러
    const handleModalClose = useCallback(() => {
        setModalOpen(false);
        setSelectedPot(null);
    }, []);

    const handlePotMarkerClick = useCallback((pot: Pot) => {
        setSelectedPot(pot);
        setModalOpen(true);
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
            }}
        >
            {!mapLoaded && <MapSkeleton />}
            <Suspense fallback={<MapSkeleton />}>
                <NaverMap
                    mapRef={mapRef}
                    isLoaded={isLoaded}
                    onLoad={() => setMapLoaded(true)}
                />

                {mapLoaded && (
                    <>
                        <ManualLocationButton />

                        <CurrentLocationMarker
                            mapRef={mapRef}
                            isLoaded={isLoaded}
                            map={map}
                            currentLocation={currentLocation}
                            currentLocationMarker={currentLocationMarker}
                            setCurrentLocationMarker={setCurrentLocationMarker}
                        />

                        <PotMarkerMaker
                            map={map}
                            pots={pots}
                            setSelectedPot={setSelectedPot}
                            onPotMarkerClick={handlePotMarkerClick}
                        />

                        {selectedPot && (
                            <PotMarkerPopup
                                pot={selectedPot}
                                open={modalOpen}
                                onClose={handleModalClose}
                            />
                        )}

                        <ManualLocationMarker
                            map={map}
                            mapRef={mapRef}
                            currentLocationMarker={currentLocationMarker}
                            isManualLocationMode={isManualLocationMode}
                            setManualLocationMode={setManualLocationMode}
                            setManualLocation={setManualLocation}
                        />
                    </>
                )}
            </Suspense>
        </div>
    );
}
