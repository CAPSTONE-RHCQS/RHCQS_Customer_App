import { Package } from "../../types/screens/Package/PackageType";
import axiosInstance, { getHeaders } from "../../utils/axios";

export const getPackages = async (): Promise<Package[]> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get('/allpackage', { headers });
        console.log('Response data:', response.data);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching package data:', error);
        return [];
    }
};

