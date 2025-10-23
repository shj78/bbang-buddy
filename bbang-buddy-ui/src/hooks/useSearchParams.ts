import { useSearchParams as useNextSearchParams } from 'next/navigation';

export const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  return searchParams;
};
