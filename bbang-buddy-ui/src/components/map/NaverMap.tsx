'use client';

interface NaverMapProps {
  mapRef: React.RefObject<HTMLDivElement | null>;
  isMapLoaded: boolean;
}

export default function NaverMap({ mapRef, isMapLoaded }: NaverMapProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>

      {/* 로딩 상태 */}
      {!isMapLoaded && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          지도 로딩 중...
        </div>
      )}
    </div>
  );
}
