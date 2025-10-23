export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  getNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  readAndRemoveNotification: (notificationId: string) => Promise<void>;
}
