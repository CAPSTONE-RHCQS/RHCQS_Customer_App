import { Package } from "../../types/screens/Package/PackageType";
import axiosInstance, { getHeaders } from "../../utils/axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getPackages = async (): Promise<Package[]> => {
    try {
        const cachedData = await AsyncStorage.getItem('packages');
        if (cachedData) {
            console.log('Using cached data');
            return JSON.parse(cachedData);
        }

        const headers = await getHeaders();
        const response = await axiosInstance.get('/allpackage', { headers });
        console.log('Response data:', response.data);
        await AsyncStorage.setItem('packages', JSON.stringify(response.data));
        return response.data || [];
    } catch (error) {
        console.error('Error fetching package data:', error);
        return [];
    }
};