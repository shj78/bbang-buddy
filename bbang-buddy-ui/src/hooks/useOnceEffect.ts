import { useEffect, useRef } from 'react';

export const useOnceEffect = (effect: () => void) => {
  const called = useRef(false);
  useEffect(() => {
    if (!called.current) {
      effect();
      called.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
