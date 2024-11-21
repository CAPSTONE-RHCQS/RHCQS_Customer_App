import { ContactDesignType, ProjectHistory, TrackingContructionType, TrackingType, TrackingVersionDesignType, VersionDetail, VersionType } from '../../types/screens/History/HistoryType';
import axiosInstance, { getHeaders } from '../../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create project
export const createProject = async (projectData: any) => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.post('/project', projectData, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get project by email
export const getProjectByEmail = async (email: string): Promise<ProjectHistory[]> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/project/email?email=${encodeURIComponent(email)}`, { headers });
    await AsyncStorage.setItem('projectHistory', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get project by id
export const getProjectById = async (projectId: string): Promise<ProjectHistory> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/project/id?id=${encodeURIComponent(projectId)}`, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get tracking
export const getTracking = async (projectId: string): Promise<TrackingType> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/project/tracking?projectId=${encodeURIComponent(projectId)}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting tracking:', error);
    throw error;
  }
};

// Get tracking payment construction
export const getTrackingPaymentContruction = async (projectId: string): Promise<TrackingContructionType> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/payment/list/app?projectId=${encodeURIComponent(projectId)}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting tracking payment construction :', error);
    throw error;
  }
};

// Get version initial quotation
export const getVersion = async (projectId: string): Promise<VersionType[]> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/quotation/initial/list?projectId=${encodeURIComponent(projectId)}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting version:', error);
    throw error;
  }
};

export const getVersionFinal = async (projectId: string): Promise<VersionType[]> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/quotation/final/list?projectId=${encodeURIComponent(projectId)}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting version:', error);
    throw error;
  }
};

// Get contact design
export const getContactDesign = async (projectId: string): Promise<ContactDesignType> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/contract/file?projectId=${encodeURIComponent(projectId)}&type=Design`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting contact design:', error);
    throw error;
  }
};

export const getContactContruction = async (projectId: string): Promise<ContactDesignType> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/contract/file?projectId=${encodeURIComponent(projectId)}&type=Construction`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting contact design:', error);
    throw error;
  }
};

// Get version design detail
export const getVersionDesignDetail = async (projectId: string): Promise<TrackingVersionDesignType[]> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/housedesign/list?projectId=${encodeURIComponent(projectId)}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting version design detail:', error);
    throw error;
  }
};

export const getVersionDesignDetailById = async (id: string): Promise<VersionDetail> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get(`/design/id?versionId=${encodeURIComponent(id)}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting version design detail:', error);
    throw error;
  }
};

// Put comment
export const putComment = async (id: string, note: string): Promise<any> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.put(
      `/quotation/initial/comment?initialId=${encodeURIComponent(id)}`,
      { note },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Put finalized
export const putFinalized = async (id: string): Promise<any> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.put(
      `/quotation/finalized?quotationId=${encodeURIComponent(id)}`,
      null,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error put finalized:', error);
    throw error;
  }
};

//put comment version design
export const putCommentVersionDesign = async (id: string, note: string): Promise<any> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.put(`/design/feedback?versionId=${encodeURIComponent(id)}`, { note }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error put comment version design:', error);
    throw error;
  }
};

//put confirmed version design
export const putConfirmVersionDesign = async (id: string): Promise<any> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.put(`/design/confirm?versionId=${encodeURIComponent(id)}`, null, { headers });
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error put confirmed version design:', error);
    throw error;
  }
};

// Cancel initial quotation
export const cancelInitialQuotation = async (id: string): Promise<any> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.put(`/project/cancel?projectId=${encodeURIComponent(id)}`, null, { headers });
    return response.data;
  } catch (error) {
    console.error('Error cancel initial quotation:', error);
    throw error;
  }
};

export const requestDesign = async (data: any) => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.post(`/housedesign/request/design`, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error request design:', error);
    throw error;
  }
};
