import axiosInstance, { getHeaders } from '../../utils/axios';

export const createProject = async (projectData: any) => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.post('/project', projectData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};
