// 기본 시간 계산 (공통 로직)
export const calculateTimeDifference = (dueDate: string): number => {
    if (!dueDate) return -1;
    const now = new Date();
    const end = new Date(dueDate);
    const diff = end.getTime() - now.getTime();
    return Math.floor(diff / (1000 * 60)); // 분 단위
};

// 정렬용
export const getTimeRemainingInMinutes = (dueDate: string): number => {
    return calculateTimeDifference(dueDate);
};

// UI 표시용
export const formatTimeRemaining = (dueDate: string): string => {
    if (!dueDate) return "시간 정보 없음";
    const now = new Date();
    const end = new Date(dueDate);
    const diffMs = end.getTime() - now.getTime();

    if (diffMs <= 0) return "마감";

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 24) {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}일 남음`;
    } else if (diffHours > 0) {
        return `${diffHours}시간 ${diffMins}분`;
    } else {
        return `${diffMins}분 남음`;
    }
};
