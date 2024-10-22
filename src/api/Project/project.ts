import {ProjectHistory, TrackingType, VersionType} from '../../types/screens/History/HistoryType';
import axiosInstance, {getHeaders} from '../../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const getProjectByEmail = async (email: string): Promise<ProjectHistory[]> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/project/email?email=${encodeURIComponent(email)}`, {headers});
    await AsyncStorage.setItem('projectHistory', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error getting project history:', error);
    throw error;
  }
};

export const getTracking = async (projectId: string): Promise<TrackingType> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/project/tracking?projectId=${encodeURIComponent(projectId)}`, {headers});
    console.log('Tracking data API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting tracking:', error);
    throw error;
  }
};

export const getVersion = async (projectId: string): Promise<VersionType[]> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/quotation/initial/list?projectId=${encodeURIComponent(projectId)}`, {headers});
    return response.data;
  } catch (error) {
    console.error('Error getting version:', error);
    throw error;
  }
};
