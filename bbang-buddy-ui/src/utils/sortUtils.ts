import { SortablePot } from "../types/pot";
import { getTimeRemainingInMinutes } from "./timeUtils";

// 마감 상태를 확인하고 정렬 우선순위를 반환하는 헬퍼 함수
const getDeadlinePriority = (timeA: number, timeB: number): number => {
    // 둘 다 마감 시간이 없는 경우
    if (timeA === -1 && timeB === -1) return 0;
    if (timeA === -1) return 1; // A를 뒤로
    if (timeB === -1) return -1; // B를 뒤로

    // 둘 다 이미 마감된 경우
    if (timeA <= 0 && timeB <= 0) return 0;
    if (timeA <= 0) return 1; // A를 뒤로
    if (timeB <= 0) return -1; // B를 뒤로

    return 0; // 둘 다 활성인 경우
};

// 정렬된 팟 목록
export const sortPots = (
    pots: SortablePot[],
    sortOrder: string
): SortablePot[] => {
    return [...pots].sort((a, b) => {
        const timeA = getTimeRemainingInMinutes(a.dueDate || "");
        const timeB = getTimeRemainingInMinutes(b.dueDate || "");

        // 마감 상태 우선 확인
        const deadlinePriority = getDeadlinePriority(timeA, timeB);
        if (deadlinePriority !== 0) return deadlinePriority;

        // 둘 다 활성인 경우에만 해당 정렬 기준 적용
        switch (sortOrder) {
            case "참여자순":
                return b.currentParticipants - a.currentParticipants; // 참여자 많은 순
            case "마감임박순":
                return timeA - timeB; // 시간 적은 순
            default:
                return 0; // 기본 순서 유지
        }
    });
};
