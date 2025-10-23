import PotMarkerPopup from '../pot/PotMarkerPopup';
import { useNearPots } from '@/hooks/usePots';
import { useState, lazy } from 'react';
import { Pot } from '@/types/pot';
import useLocationStore from '@/store/useLocationStore';
import useManualLocationCursor from '@/hooks/useManualLocationCursor';
import useManualLocationClick from '@/hooks/useManualLocationClick';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface MapOverlayProps {
  mapRef: React.RefObject<HTMLDivElement | null>;
  isMapLoaded: boolean;
  map: NaverMap | null;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  currentLocationMarker: NaverMarker | null;
  setCurrentLocationMarker: (marker: NaverMarker | null) => void;
}

const PotMarkerMaker = lazy(() => import('./PotMarkerMaker'));
const CurrentLocationMarker = lazy(() => import('./CurrentLocationMarker'));
const ManualLocationButton = lazy(() => import('./ManualLocationButton'));

export default function MapOverlay({
  mapRef,
  isMapLoaded,
  map,
  currentLocation,
  currentLocationMarker,
  setCurrentLocationMarker,
}: MapOverlayProps) {
  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { isManualLocationMode, setManualLocationMode, setManualLocation } =
    useLocationStore();

  useManualLocationCursor({ mapRef, isManualLocationMode });
  useManualLocationClick({
    map,
    currentLocationMarker,
    setManualLocation,
    setManualLocationMode,
    isManualLocationMode,
  });

  const { pots, potsLoading, potsError, potsRefetch } = useNearPots({
    latitude: currentLocation?.latitude,
    longitude: currentLocation?.longitude,
  });

  if (potsLoading) return <LoadingSpinner count={4} />;
  if (potsError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('팟 조회 실패:', potsError.message);
    }
    return (
      <ErrorMessage
        message="팟을 불러오는 중 오류가 발생했습니다."
        onRetry={() => potsRefetch()}
      />
    );
  }

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedPot(null);
  };

  const handlePotMarkerClick = (pot: Pot) => {
    setSelectedPot(pot);
    setModalOpen(true);
  };

  return (
    <>
      {isMapLoaded && (
        <>
          <ManualLocationButton />

          <CurrentLocationMarker
            mapRef={mapRef}
            isMapLoaded={isMapLoaded}
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
        </>
      )}
    </>
  );
}
