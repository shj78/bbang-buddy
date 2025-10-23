import { create } from 'zustand';
import { NotificationState, Notification } from '../types/notification';
import {
  getNotifications,
  readNotification as readNotificationApi,
} from '../lib/notificationApi';
import { getCookie } from '../utils/cookieUtils';

const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  getNotifications: async () => {
    const token = getCookie('authToken');
    try {
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }
      const notifications = await getNotifications(token);
      const unreadCount = notifications.filter(
        (n: Notification) => !n.read
      ).length;
      set({ notifications, unreadCount });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('알림 조회 실패:', error);
      }
      set({ notifications: [], unreadCount: 0 });
    }
  },
  readAndRemoveNotification: async (notificationId: string) => {
    try {
      await readNotificationApi(Number(notificationId));
      const { notifications } = get();
      const updatedNotifications = notifications.filter(
        (n) => n.id !== notificationId
      );
      const unreadCount = updatedNotifications.filter((n) => !n.read).length;
      set({ notifications: updatedNotifications, unreadCount });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('알림 읽음/삭제 처리 실패:', error);
      }
    }
  },
  addNotification: (notification: Notification) => {
    const { notifications } = get();

    const safeNotification = {
      ...notification,
      read: notification.read ?? false,
    };
    const newNotifications = [safeNotification, ...notifications];
    const unreadCount = newNotifications.filter((n) => !n.read).length;
    set({ notifications: newNotifications, unreadCount });
  },
}));

export default useNotificationStore;
