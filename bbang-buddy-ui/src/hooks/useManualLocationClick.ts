import { useEffect } from 'react';

function useManualLocationClick({
  map,
  currentLocationMarker,
  setManualLocation,
  setManualLocationMode,
  isManualLocationMode,
}: {
  map: NaverMap | null;
  currentLocationMarker: NaverMarker | null;
  setManualLocation: (location: {
    latitude: number;
    longitude: number;
  }) => void;
  setManualLocationMode: (mode: boolean) => void;
  isManualLocationMode: boolean;
}) {
  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e: {
      coord: { lat: () => number; lng: () => number };
    }) => {
      if (isManualLocationMode) {
        const clickedLat = e.coord.lat();
        const clickedLng = e.coord.lng();

        if (currentLocationMarker) {
          currentLocationMarker.setMap(null);
        }
        setManualLocation({
          latitude: clickedLat,
          longitude: clickedLng,
        });

        setManualLocationMode(false);

        map.setCenter(new window.naver.maps.LatLng(clickedLat, clickedLng));
      }
    };

    const listener = window.naver.maps.Event.addListener(
      map,
      'click',
      handleMapClick
    );

    return () => {
      if (listener) {
        window.naver.maps.Event.removeListener(listener);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, isManualLocationMode]);
}

export default useManualLocationClick;
