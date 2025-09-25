import apiClient from "./apiClient";
import { PotCreateRequest } from "../types/pot";
import { useAuthStore } from "../store/useAuthStore";

// 팟 생성 (항상 FormData로 전송)
export const createPot = async (
    potData: PotCreateRequest,
    image?: File | null
) => {
    try {
        // 서버가 항상 multipart/form-data를 기대하므로 항상 FormData 사용
        const formData = new FormData();

        // JSON 데이터를 Blob으로 감싸서 Content-Type을 application/json으로 명시
        const potDataBlob = new Blob([JSON.stringify(potData)], {
            type: "application/json",
        });
        formData.append("potData", potDataBlob);

        if (image && image instanceof File) {
            formData.append("image", image);
        }

        const response = await apiClient.post("/api/pot/upsert", formData);
        return response.data;
    } catch (error) {
        console.error("팟 생성 실패:", error);
        throw error;
    }
};

// 팟 참여
export const joinPot = async (potId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
        // 로그인 만료시 null일 수 있음
        throw new Error("로그인 후 이용해주세요.");
    }
    const response = await apiClient.post("/api/participant", {
        potId,
        userId: user.userId,
        notificationMessage: `${user.userId}님께서 참여하셨습니다.`,
    });
    return response.data;
};

// 팟 탈퇴
export const leavePot = async (potId: string) => {
    const response = await apiClient.delete(`/api/participant/${potId}`);
    return response.data;
};

// 근처 팟 조회
export const getNearPots = async (
    latitude: number,
    longitude: number,
    distance: number = 3
) => {
    const response = await apiClient.get("/api/pot/near", {
        params: { latitude, longitude, distance },
    });
    return response.data;
};

// 내 팟 조회
export const getMyPots = async () => {
    const response = await apiClient.get("/api/pot/my");
    return response.data;
};

// 전체 팟 조회
export const getAllPots = async () => {
    const response = await apiClient.get("/api/pot");
    return response.data;
};

// 팟 검색
export const searchPots = async (keyword: string) => {
    const response = await apiClient.get("/api/pot/search", {
        params: { keyword },
    });

    return response.data;
};
