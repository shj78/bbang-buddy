import apiClient from "./apiClient";

export const sendQuestion = async (question: {
    title: string;
    description: string;
}) => {
    const response = await apiClient.post("/api/user/me/qanda", question);
    return response.data;
};
