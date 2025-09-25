import { useCallback, useEffect, useRef, useState } from "react";
import { ClusterPopup } from "./ClusterPopup";
import { Pot, PotMarkerMakerProps } from "../../types/pot";
import { formatTimeRemaining } from "../../utils/timeUtils";
import { clusterMarkers, createClusterIcon } from "../../utils/clusterUtils";

export default function PotMarkerMaker({
    map,
    pots,
    setSelectedPot,
    onPotMarkerClick,
}: PotMarkerMakerProps) {
    const markersRef = useRef<NaverMarker[]>([]);
    const clustersRef = useRef<NaverMarker[]>([]);
    const [clusterPopupOpen, setClusterPopupOpen] = useState(false);
    const [clusterPotsToShow, setClusterPotsToShow] = useState<Pot[]>([]);

    // 팟 마커 클릭 핸들러
    const handlePotMarkerClick = useCallback(
        (pot: Pot) => {
            setSelectedPot(pot);
            onPotMarkerClick(pot);
        },
        [setSelectedPot, onPotMarkerClick]
    );

    // 클러스터 클릭 핸들러
    const handleClusterClick = useCallback((clusterPots: Pot[]) => {
        setClusterPotsToShow(clusterPots);
        setClusterPopupOpen(true);
    }, []);

    // 클러스터 팝업 닫기 핸들러
    const handleClusterPopupClose = useCallback(() => {
        setClusterPopupOpen(false);
        setClusterPotsToShow([]);
    }, []);

    // 클러스터 팟 클릭 핸들러
    const handleClusterPotClick = useCallback(
        (pot: Pot) => {
            handleClusterPopupClose();
            handlePotMarkerClick(pot);
        },
        [handleClusterPopupClose, handlePotMarkerClick]
    );

    // Pot 마커들 추가
    useEffect(() => {
        if (!map) return;

        // 1. 기존 마커들과 클러스터들을 모두 지도에서 제거
        markersRef.current.forEach((marker) => {
            marker.setMap(null);
        });
        clustersRef.current.forEach((cluster) => {
            cluster.setMap(null);
        });
        markersRef.current = [];
        clustersRef.current = [];

        if (pots && Array.isArray(pots) && map) {
            // 2. 마커 클러스터링
            const clusters = clusterMarkers(pots); //useMemo 적용후 성능이 더 안좋아짐

            clusters.forEach((cluster) => {
                if (cluster.pots.length === 1) {
                    // 단일 마커
                    const pot = cluster.pots[0];
                    const remain =
                        pot.maxParticipants - pot.currentParticipants;
                    const remainingTime = formatTimeRemaining(pot.dueDate);

                    let markerColor = "#7DD952";
                    if (remainingTime === "마감") {
                        markerColor = "#909090";
                    } else if (remain === 1) {
                        markerColor = "#ff4444";
                    }

                    const potMarker = new window.naver.maps.Marker({
                        position: new window.naver.maps.LatLng(
                            pot.latitude!,
                            pot.longitude!
                        ),
                        map,
                        title: pot.title,
                        icon: {
                            content: `
                                <div style="position: relative; width: 36px; height: 36px;">
                                    <svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' style="position: absolute; top: 0; left: 0;">
                                        <path fill='black' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/>
                                        <circle cx='12' cy='9' r='2.5' fill='${markerColor}'/>
                                    </svg>
                                </div>
                            `,
                            anchor: new window.naver.maps.Point(18, 36),
                        },
                    });

                    markersRef.current.push(potMarker);

                    window.naver.maps.Event.addListener(
                        potMarker,
                        "click",
                        () => {
                            handlePotMarkerClick(pot);
                        }
                    );
                } else {
                    // 클러스터 마커
                    const clusterMarker = new window.naver.maps.Marker({
                        position: new window.naver.maps.LatLng(
                            cluster.center.lat,
                            cluster.center.lng
                        ),
                        map,
                        title: `${cluster.pots.length}개의 팟`,
                        icon: {
                            content: createClusterIcon(cluster.pots.length),
                            anchor: new window.naver.maps.Point(20, 20),
                        },
                    });

                    clustersRef.current.push(clusterMarker);

                    window.naver.maps.Event.addListener(
                        clusterMarker,
                        "click",
                        () => {
                            handleClusterClick(cluster.pots);
                        }
                    );
                }
            });
        }
    }, [pots, map, handlePotMarkerClick, handleClusterClick]);

    return (
        <div>
            <ClusterPopup
                open={clusterPopupOpen}
                onClose={handleClusterPopupClose}
                clusterPots={clusterPotsToShow}
                onPotClick={handleClusterPotClick}
            />
        </div>
    );
}
