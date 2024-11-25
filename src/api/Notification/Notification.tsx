import axiosInstance, {getHeaders} from '../../utils/axios';

export const sendFCM = async (data: any) => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.post(
      '/notification/save-token',
      data,
      {headers},
    );
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};
