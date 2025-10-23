export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationState {
  currentLocation: Location;
  manualLocation: Location | null;
  isManualLocationMode: boolean;
  getCurrentLocation: () => void;
  setManualLocation: (location: Location) => void;
  setManualLocationMode: (mode: boolean) => void;
}

export interface ManualLocationMarkerProps {
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
