import {HouseTemplate} from '../../types/screens/HouseTemplate/HouseTemplateType';
import axiosInstance, {getHeaders} from '../../utils/axios';

// Create project
export const createProjectHouseTemplate = async (projectData: any) => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.post('/project/template-house', projectData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};


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
    throw error;
  }
};
