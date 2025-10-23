export interface GeocodingResult {
  latitude: number;
  longitude: number;
  address: string;
}

export type GeocodingSuccessCallback = (result: GeocodingResult) => void;

export type GeocodingErrorCallback = (error: string) => void;

export type GeocodingLoadingCallback = (isLoading: boolean) => void;
