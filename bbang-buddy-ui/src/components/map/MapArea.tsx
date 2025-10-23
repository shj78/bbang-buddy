import { useState, Suspense, lazy } from 'react';
import { useMap } from '../../hooks/useMap';
import MapSkeleton from './MapSkeleton';
import MapOverlay from './MapOverlay';
import Script from 'next/script';
import { isBrowser } from '@/utils/typeUtils';
import { useEffect } from 'react';

const NaverMap = lazy(() => import('./NaverMap'));

export default function MapArea() {
  const [isSDKScriptLoaded, setIsSDKScriptLoaded] = useState(false);

  useEffect(() => {
    if (isBrowser()) {
      const isAlreadyLoaded =
        localStorage.getItem('isSDKScriptLoaded') === 'true';
      if (isAlreadyLoaded) {
        setIsSDKScriptLoaded(true);
      }
    }
  }, [isSDKScriptLoaded]);

  const {
    mapRef,
    isMapLoaded,
    map,
    currentLocation,
    currentLocationMarker,
    setCurrentLocationMarker,
  } = useMap(isSDKScriptLoaded);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <Script
        src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=saihurntip&submodules=geocoder"
        strategy="afterInteractive"
        id="naver-map-script"
        onLoad={() => {
          if (isBrowser()) {
            localStorage.setItem('isSDKScriptLoaded', 'true');
            setIsSDKScriptLoaded(true);
          }
        }}
      />
      {isSDKScriptLoaded && (
        <Suspense fallback={<MapSkeleton />}>
          <NaverMap mapRef={mapRef} isMapLoaded={isMapLoaded} />

          {isMapLoaded && (
            <MapOverlay
              mapRef={mapRef}
              isMapLoaded={isMapLoaded}
              map={map}
              currentLocation={currentLocation}
              currentLocationMarker={currentLocationMarker}
              setCurrentLocationMarker={setCurrentLocationMarker}
            />
          )}
        </Suspense>
      )}
    </div>
  );
}
