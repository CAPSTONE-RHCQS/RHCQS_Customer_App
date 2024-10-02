import axiosInstance from '../../utils/axios';
import { Construction } from '../../types/screens/Contruction/ContructionType';

export const getConstructionOption = async (): Promise<Construction['Items']> => {
  try {
    const response = await axiosInstance.get('/construction?page=1&size=24');
    return response.data.Items;
  } catch (error) {
    console.error('Error fetching construction data:', error);
    return [];
  }
};