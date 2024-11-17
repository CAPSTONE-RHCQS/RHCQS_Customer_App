import { PromotionType } from "../../types/screens/Promotion/Promotion";
import { getHeaders } from "../../utils/axios";
import axiosInstance from "../../utils/axios";

export const getPromotion = async (): Promise<PromotionType[]> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get('/promotion/valid', {
            headers,
        });
        return response.data;

    } catch (error) {
        console.error('Error fetching promotion data:', error);
        throw error;
    }
};