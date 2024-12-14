import {DesignPriceResponse} from '@/types/screens/DesignPrice/DesignPrice';
import axiosInstance, {getHeaders} from '../../utils/axios';

export const getDesignPrice = async (): Promise<DesignPriceResponse> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/alldesignprices`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching construction data:', error);
    throw error;
  }
};
