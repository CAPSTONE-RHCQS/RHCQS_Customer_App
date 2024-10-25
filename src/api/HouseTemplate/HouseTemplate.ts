import {HouseTemplate} from '../../types/screens/HouseTemplate/HouseTemplateType';
import axiosInstance, {getHeaders} from '../../utils/axios';

export const getHouseTemplate = async (): Promise<HouseTemplate[]> => {
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

export const getHouseTemplateById = async (
  houseId: string,
): Promise<HouseTemplate> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/housetemplate/id?id=${houseId}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching house template data:', error);
    throw error; // Ném lỗi để xử lý bên ngoài
  }
};
