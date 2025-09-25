"use client";

import { useAllPots } from "../../hooks/usePots";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import PotList from "../pot/PotList";

export default function AllPotClient() {
    const { allPots, allPotsLoading, allPotsError, allPotsRefetch } =
        useAllPots();

    if (allPotsLoading) return <LoadingSpinner count={5} />;
    if (allPotsError) return <ErrorMessage onRetry={allPotsRefetch} />;

    return (
        <PotList
            title="모든 팟"
            pots={allPots}
            buttonText="보기"
            emptyType="list"
            emptyMessage="등록된 팟이 없습니다"
            emptyDescription="새로운 팟을 만들어보세요"
        />
    );
}
