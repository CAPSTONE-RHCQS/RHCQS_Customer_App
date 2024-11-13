import { Package } from "../../types/screens/Package/PackageType";
import axiosInstance, { getHeaders } from "../../utils/axios";

export const getPackages = async (): Promise<Package[]> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get('/allpackage', { headers });
        return response.data || [];
    } catch (error) {
        console.error('Error fetching package data:', error);
        return [];
    }
};