import { useEffect } from 'react';

export default function CurrentLocationMarker({
  map,
  currentLocation,
  currentLocationMarker,
  setCurrentLocationMarker,
}: {
  mapRef: React.RefObject<HTMLDivElement | null>;
  isMapLoaded: boolean;
  map: NaverMap | null;
  currentLocation: { latitude: number; longitude: number } | null;
  currentLocationMarker: NaverMarker | null;
  setCurrentLocationMarker: (marker: NaverMarker | null) => void;
}) {
  useEffect(() => {
    if (!map || !currentLocation?.latitude || !currentLocation?.longitude)
      return;

    if (currentLocationMarker) {
      currentLocationMarker.setMap(null);
    }

    const newMarker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(
        currentLocation.latitude,
        currentLocation.longitude
      ),
      map: map,
      title: '현재 위치',
      icon: {
        content: (() => {
          const div = document.createElement('div');
          div.style.background = '#4285f4';
          div.style.width = '15px';
          div.style.height = '15px';
          div.style.borderRadius = '50%';
          div.style.border = '3px solid white';
          div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
          return div.outerHTML;
        })(),
        anchor: new window.naver.maps.Point(10.5, 10.5),
      },
    });

    setCurrentLocationMarker(newMarker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, currentLocation]);

  return null;
}
