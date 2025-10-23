'use client';

import { useMyPots } from '../../hooks/usePots';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import PotList from '../pot/PotList';

export default function MyPotClient() {
  const { myPots, myPotsLoading, myPotsError, myPotsRefetch } = useMyPots();

  if (myPotsLoading) return <LoadingSpinner count={3} />;
  if (myPotsError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('나의 팟 조회 실패:', myPotsError.message);
    }
    return (
      <ErrorMessage
        message="나의 팟을 불러오는 중 오류가 발생했습니다."
        onRetry={() => myPotsRefetch()}
      />
    );
  }

  return (
    <PotList
      title="나의 팟"
      pots={myPots || []}
      buttonText="보기"
      emptyType="list"
      emptyMessage="참여한 팟이 없습니다"
      emptyDescription="새로운 팟에 참여해보세요"
    />
  );
}
