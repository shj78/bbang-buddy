import { useEffect, useRef } from "react";

// 한 번만 실행되는 useEffect 훅 : 카카오맵 API 초기화, 네이버 지도 API 초기화 등
export const useOnceEffect = (effect: () => void) => {
    const called = useRef(false);
    useEffect(() => {
        if (!called.current) {
            effect();
            called.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 한 번만 실행
};
