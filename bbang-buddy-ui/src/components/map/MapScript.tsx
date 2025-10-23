import Script from 'next/script';

export default function MapScript() {
  return (
    <Script
      src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`}
      strategy="afterInteractive"
      id="kakao-map-script"
    />
  );
}
