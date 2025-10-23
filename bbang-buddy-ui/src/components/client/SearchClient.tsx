'use client';

import { useSearchPots } from '../../hooks/usePots';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import PotList from '../pot/PotList';
import { useSearchParams } from '../../hooks/useSearchParams';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const keyword = searchParams?.get('q') || '';

  // 검색어를 title, description, address에 적용
  const { searchPots, searchPotsLoading, searchPotsError, searchPotsRefetch } =
    useSearchPots(keyword);

  if (searchPotsLoading) return <LoadingSpinner count={4} />;
  if (searchPotsError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('팟 검색 실패:', searchPotsError.message);
    }
    return (
      <ErrorMessage
        message="검색 결과를 불러오는 중 오류가 발생했습니다."
        onRetry={() => searchPotsRefetch()}
      />
    );
  }

  return (
    <PotList
      pots={searchPots}
      buttonText="보기"
      emptyType="search"
      emptyMessage={`"${keyword}" 검색 결과가 없습니다`}
      emptyDescription="다른 검색어로 시도해보세요"
    />
  );
}
