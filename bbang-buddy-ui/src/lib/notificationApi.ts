import apiClient from './apiClient';
import { Notification } from '../types/notification';

export const getNotifications = async (
  token: string
): Promise<Notification[]> => {
  const response = await apiClient.get(`/api/notification?token=${token}`);
  return response.data;
};

export const readNotification = async (
  notificationId: number
): Promise<Notification[]> => {
  const response = await apiClient.put(
    `/api/notification/read-all/${notificationId}`
  );
  return response.data;
};
