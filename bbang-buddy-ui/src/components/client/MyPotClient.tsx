"use client";

import { useMyPots } from "../../hooks/usePots";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import PotList from "../pot/PotList";

export default function MyPotClient() {
    const { myPots, myPotsLoading, myPotsError, myPotsRefetch } = useMyPots();

    if (myPotsLoading) return <LoadingSpinner count={3} />;
    if (myPotsError) return <ErrorMessage onRetry={myPotsRefetch} />;

    return (
        <PotList
            title="나의 팟"
            pots={myPots}
            buttonText="보기"
            emptyType="list"
            emptyMessage="참여한 팟이 없습니다"
            emptyDescription="새로운 팟에 참여해보세요"
        />
    );
}
