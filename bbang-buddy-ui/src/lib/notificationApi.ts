import apiClient from "./apiClient";
import { Notification } from "../types/notification";

//로그인한 사용자의 알림 조회
export const getNotifications = async (
    token: string
): Promise<Notification[]> => {
    const response = await apiClient.get(`/api/notification?token=${token}`);
    return response.data;
};

//알림 읽음 처리
export const readNotification = async (
    notificationId: number
): Promise<Notification[]> => {
    const response = await apiClient.put(
        `/api/notification/read-all/${notificationId}`
    );
    return response.data;
};

// //알림 구독 요청 (토큰을 파라미터로 전달, 타임아웃 0)
// export const subscribeNotifications = async (token: string) => {
//     const response = await apiClient.get(`/api/notification/subscribe?token=${token}`, {
//         timeout: 0 // 무제한 대기
//     });
//     return response.data;
// };
