import { HouseTemplate, Item } from "../../types/screens/HouseTemplate/HouseTemplateType";
import axiosInstance, { getHeaders } from "../../utils/axios";

export const getHouseTemplate = async (): Promise<HouseTemplate['Items']> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get('/allhousetemplate', { headers });
        console.log('Response data:', response.data);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching house template data:', error);
        return [];
    }
};
