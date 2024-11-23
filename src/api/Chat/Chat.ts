import { ChatData, ChatDetail } from '../../types/screens/Chat/Chat';
import axiosInstance, { getHeaders } from '../../utils/axios';

export const getChatList = async (accountId: string): Promise<ChatData[]> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get(`/room/waiting?accountId=${accountId}`, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching construction data:', error);
        throw error;
    }
};

export const getChatDetail = async (roomId: string): Promise<ChatDetail> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get(`/room/message?roomId=${roomId}`, {headers});
        return response.data;
    } catch (error) {
        console.error('Error fetching chat detail:', error);
        throw error;
    }
};
