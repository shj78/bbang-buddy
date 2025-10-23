import { useEffect } from 'react';
import { MAP_DEFAULT_MARKER_SVG } from '../constants/image';

function useManualLocationCursor({
  mapRef,
  isManualLocationMode,
}: {
  mapRef: React.RefObject<HTMLDivElement | null>;
  isManualLocationMode: boolean;
}) {
  useEffect(() => {
    if (!mapRef?.current) return;

    const mapContainer = mapRef.current!;

    if (isManualLocationMode) {
      const markerCursor = MAP_DEFAULT_MARKER_SVG;

      mapContainer.style.cursor = markerCursor;
      mapContainer.style.setProperty('cursor', markerCursor, 'important');

      const allMapElements = mapContainer.querySelectorAll('*');
      allMapElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.cursor = markerCursor;
        htmlElement.style.setProperty('cursor', markerCursor, 'important');
      });
    } else {
      mapContainer.style.cursor = '';
      mapContainer.style.removeProperty('cursor');

      const allMapElements = mapContainer.querySelectorAll('*');
      allMapElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.cursor = '';
        htmlElement.style.removeProperty('cursor');
      });
    }
  }, [isManualLocationMode, mapRef]);
}

export default useManualLocationCursor;
