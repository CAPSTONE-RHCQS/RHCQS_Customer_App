import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ultilities } from "../../types/screens/Ultilities/UltilitiesType";
import axiosInstance, { getHeaders } from "../../utils/axios";

export const getAllUltilities = async (): Promise<Ultilities[]> => {
    try {
        const cachedData = await AsyncStorage.getItem('ultilities');
        if (cachedData) {
            console.log('Using cached data');
            return JSON.parse(cachedData);
        }
        
        const headers = await getHeaders();
        const response = await axiosInstance.get('/utilities/type?type=ALL', { headers });
        console.log('Response data:', response.data);
        await AsyncStorage.setItem('ultilities', JSON.stringify(response.data));
        return response.data || [];
    } catch (error) {
        console.error('Error fetching ultilities data:', error);
        return [];
    }
};

export const getRoughUltilities = async (): Promise<Ultilities[]> => {
    try {
        const cachedData = await AsyncStorage.getItem('ultilities');
        if (cachedData) {
            console.log('Using cached data');
            return JSON.parse(cachedData);
        }
        
        const headers = await getHeaders();
        const response = await axiosInstance.get('/utilities/type?type=ROUGH', { headers });
        console.log('Response data:', response.data);
        await AsyncStorage.setItem('ultilities', JSON.stringify(response.data));
        return response.data || [];
    } catch (error) {
        console.error('Error fetching ultilities data:', error);
        return [];
    }
};

export const getFinishedUltilities = async (): Promise<Ultilities[]> => {
    try {
        const cachedData = await AsyncStorage.getItem('ultilities');
        if (cachedData) {
            console.log('Using cached data');
            return JSON.parse(cachedData);
        }
        
        const headers = await getHeaders();
        const response = await axiosInstance.get('/utilities/type?type=FINISHED', { headers });
        console.log('Response data:', response.data);
        await AsyncStorage.setItem('ultilities', JSON.stringify(response.data));
        return response.data || [];
    } catch (error) {
        console.error('Error fetching ultilities data:', error);
        return [];
    }
};

export const getUltilitiesById = async (id: string): Promise<Ultilities | null> => {
    try {
        const cacheKey = `ultilities_${id}`;
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
            console.log('Using cached data for id:', id);
            return JSON.parse(cachedData);
        }
        
        const headers = await getHeaders();
        const response = await axiosInstance.get(`/utilities/section/id?id=${id}`, { headers });
        console.log('Response data for id:', id, response.data);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data));
        return response.data || null;
    } catch (error) {
        console.error('Error fetching ultilities data by id:', id, error);
        return null;
    }
};

