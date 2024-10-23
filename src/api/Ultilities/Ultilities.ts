import { Section, Ultilities } from "../../types/screens/Ultilities/UltilitiesType";
import axiosInstance, { getHeaders } from "../../utils/axios";

export const getAllUltilities = async (): Promise<Ultilities[]> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get('/utilities/type?type=ALL', { headers });
        console.log('Response data:', response.data);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching ultilities data:', error);
        return [];
    }
};

export const getRoughUltilities = async (): Promise<Ultilities[]> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get('/utilities/type?type=ROUGH', { headers });
        console.log('Response data:', response.data);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching ultilities data:', error);
        return [];
    }
};

export const getFinishedUltilities = async (): Promise<Ultilities[]> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get('/utilities/type?type=FINISHED', { headers });
        console.log('Response data:', response.data);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching ultilities data:', error);
        return [];
    }
};

export const getUltilitiesById = async (id: string): Promise<Ultilities | null> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get(`/utilities/section/id?id=${id}`, { headers });
        console.log('Response data for id:', id, response.data);
        return response.data || null;
    } catch (error) {
        console.error('Error fetching ultilities data by id:', id, error);
        return null;
    }
};

export const getUltilitiesSectionById = async (id: string): Promise<Section | null> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get(`/utilities/section/id?id=${id}`, { headers });
        console.log('Response data for id:', id, response.data);
        return response.data || null;
    } catch (error) {
        console.error('Error fetching ultilities data by id:', id, error);
        return null;
    }
};
