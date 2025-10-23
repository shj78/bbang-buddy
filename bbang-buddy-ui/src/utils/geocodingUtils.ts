import { FORM_CONSTANTS } from '../constants/formConstants';
import {
  GeocodingSuccessCallback,
  GeocodingErrorCallback,
  GeocodingLoadingCallback,
  GeocodingResult,
} from '../types/geocoding';
import { isBrowser } from './typeUtils';

export const searchAddressWithKakao = (
  address: string,
  onSuccess: GeocodingSuccessCallback,
  onError: GeocodingErrorCallback,
  onLoadingChange: GeocodingLoadingCallback
) => {
  if (!isBrowser()) return;

  if (!address.trim()) {
    onError(FORM_CONSTANTS.ERROR_MESSAGES.addressRequired);
    return;
  }

  onLoadingChange(true);

  if (!window.kakao || !window.kakao.maps) {
    onError(FORM_CONSTANTS.ERROR_MESSAGES.kakaoApiNotLoaded);
    onLoadingChange(false);
    return;
  }

  window.kakao.maps.load(() => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const places = new window.kakao.maps.services.Places();

    geocoder.addressSearch(address, (addressResult, addressStatus) => {
      if (addressStatus === window.kakao.maps.services.Status.OK) {
        const coords = addressResult[0];
        const result: GeocodingResult = {
          latitude: parseFloat(coords.y),
          longitude: parseFloat(coords.x),
          address: coords.road_address?.address_name || coords.address_name,
        };

        onSuccess(result);
        onLoadingChange(false);
      } else {
        places.keywordSearch(address, (keywordResult, keywordStatus) => {
          onLoadingChange(false);

          if (
            keywordStatus === window.kakao.maps.services.Status.OK &&
            keywordResult.length > 0
          ) {
            const place = keywordResult[0];
            const baseAddress = place.road_address_name || place.address_name;
            const fullAddress = `${place.place_name} (${baseAddress})`;

            const result: GeocodingResult = {
              latitude: parseFloat(place.y),
              longitude: parseFloat(place.x),
              address: fullAddress,
            };

            onSuccess(result);
          } else {
            onError(FORM_CONSTANTS.ERROR_MESSAGES.addressNotFound);
          }
        });
      }
    });
  });
};
