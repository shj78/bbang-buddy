import { create } from "zustand";
import { NotificationState, Notification } from "../types/notification";
import {
    getNotifications,
    readNotification as readNotificationApi,
} from "../lib/notificationApi";
import { getCookie } from "../utils/cookieUtils";

const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    // 알림 조회
    getNotifications: async () => {
        const token = getCookie("authToken");
        try {
            if (!token) {
                throw new Error("토큰이 없습니다.");
            }
            const notifications = await getNotifications(token);
            const unreadCount = notifications.filter(
                (n: Notification) => !n.isRead
            ).length;
            set({ notifications, unreadCount });
        } catch (error) {
            console.error("알림 조회 실패:", error);
            set({ notifications: [], unreadCount: 0 });
        }
    },
    // 알림 읽음 처리 + 리스트에서 제거
    readAndRemoveNotification: async (notificationId: string) => {
        try {
            await readNotificationApi(Number(notificationId)); // 서버에 읽음 처리
            const { notifications } = get();
            const updatedNotifications = notifications.filter(
                (n) => n.id !== notificationId
            );
            const unreadCount = updatedNotifications.filter(
                (n) => !n.isRead
            ).length;
            set({ notifications: updatedNotifications, unreadCount });
        } catch (error) {
            console.error("알림 읽음/삭제 처리 실패:", error);
        }
    },
    // 알림 추가
    addNotification: (notification: Notification) => {
        const { notifications } = get();

        // read 필드가 없으면 false로 설정
        const safeNotification = {
            ...notification,
            isRead: notification.isRead ?? false,
        };
        const newNotifications = [safeNotification, ...notifications];
        const unreadCount = newNotifications.filter((n) => !n.isRead).length;
        set({ notifications: newNotifications, unreadCount });
    },
}));

export default useNotificationStore;
