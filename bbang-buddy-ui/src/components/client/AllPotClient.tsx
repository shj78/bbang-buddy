'use client';

import { useAllPots } from '../../hooks/usePots';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import PotList from '../pot/PotList';

export default function AllPotClient() {
  const { allPots, allPotsLoading, allPotsError, allPotsRefetch } =
    useAllPots();

  if (allPotsLoading) return <LoadingSpinner count={3} />;
  if (allPotsError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('모든 팟 조회 실패:', allPotsError.message);
    }
    return (
      <ErrorMessage
        message="모든 팟을 불러오는 중 오류가 발생했습니다."
        onRetry={() => allPotsRefetch()}
      />
    );
  }

  return (
    <PotList
      title="모든 팟"
      pots={allPots || []}
      buttonText="보기"
      emptyType="list"
      emptyMessage="등록된 팟이 없습니다"
      emptyDescription="새로운 팟을 만들어보세요"
    />
  );
}
