// 알림 한 건에 대한 타입 정의
export interface Notification {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

//Zustand에서 관리하는 알림 전체 상태 정의
export interface NotificationState {
    notifications: Notification[]; //알림 목록
    unreadCount: number; //읽지 않은 알림 개수
    getNotifications: () => Promise<void>; //알림 목록 조회
    addNotification: (notification: Notification) => void; //알림 추가
    readAndRemoveNotification: (notificationId: string) => Promise<void>; //알림 읽음 처리 및 삭제
}
