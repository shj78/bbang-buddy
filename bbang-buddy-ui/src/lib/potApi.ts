import apiClient from './apiClient';
import { PotFormData } from '../types/pot';
import { useAuthStore } from '../store/useAuthStore';

export const createPot = async (potData: PotFormData, image?: File | null) => {
  try {
    const formData = new FormData();

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      image: _image,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      chatRoomUrl: _chatRoomUrl,
      ...potDataToSend
    } = potData;

    const potDataBlob = new Blob([JSON.stringify(potDataToSend)], {
      type: 'application/json',
    });
    formData.append('potData', potDataBlob);

    if (image && image instanceof File) {
      formData.append('image', image);
    }

    const response = await apiClient.post('/api/pot/upsert', formData);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('팟 생성 실패:', error);
    }
  }
};

export const joinPot = async (potId: string) => {
  const user = useAuthStore.getState().user;
  if (!user) {
    throw new Error('로그인 후 이용해주세요.');
  }
  const response = await apiClient.post('/api/participant', {
    potId,
    userId: user.userId,
    notificationMessage: `${user.userId}님께서 참여하셨습니다.`,
  });
  return response.data;
};

export const leavePot = async (potId: string) => {
  const response = await apiClient.delete(`/api/participant/${potId}`);
  return response.data;
};

export const getNearPots = async (
  latitude: number,
  longitude: number,
  distance: number = 3
) => {
  const response = await apiClient.get('/api/pot/near', {
    params: { latitude, longitude, distance },
  });
  return response.data;
};

export const getMyPots = async () => {
  const response = await apiClient.get(`/api/pot/my`);
  return response.data;
};

export const getAllPots = async () => {
  const response = await apiClient.get(`/api/pot`);
  return response.data;
};

export const searchPots = async (keyword: string) => {
  const response = await apiClient.get(`/api/pot/search`, {
    params: { keyword },
  });

  return response.data;
};
