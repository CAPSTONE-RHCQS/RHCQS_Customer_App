import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ultilities } from "../../types/screens/Ultilities/UltilitiesType";
import axiosInstance, { getHeaders } from "../../utils/axios";

export const getUltilities = async (): Promise<Ultilities[]> => {
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

