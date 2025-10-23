export interface KakaoAddressResult {
  y: string;
  x: string;
  address_name: string;
  road_address?: {
    address_name: string;
  };
}

export interface KakaoKeywordResult {
  y: string;
  x: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
}
