import { HouseTemplate, Item } from "../../types/screens/HouseTemplate/HouseTemplateType";
import axiosInstance, { getHeaders } from "../../utils/axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getHouseTemplate = async (): Promise<HouseTemplate[]> => {
    try {
        const cachedData = await AsyncStorage.getItem('houseTemplate');
        if (cachedData) {
            console.log('Using cached data');
            return JSON.parse(cachedData);
        }

        const headers = await getHeaders();
        const response = await axiosInstance.get('/housetemplate?page=1&size=10', { headers });
        console.log('Response data:', response.data);
        await AsyncStorage.setItem('houseTemplate', JSON.stringify(response.data));
        return response.data || [];
    } catch (error) {
        console.error('Error fetching house template data:', error);
        return [];
    }
};