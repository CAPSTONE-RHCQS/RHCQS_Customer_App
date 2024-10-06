import { Package } from "@/types/screens/Package/PackageType";
import axiosInstance, { getHeaders } from "../../utils/axios";

export const getPackages = async (): Promise<Package['Items']> => {
    try {
        // const headers = await getHeaders();
        const response = await axiosInstance.get('/package?page=1&size=8');
        console.log('Response data:', response.data);
        return response.data.Items||[];
    } catch (error) {
        console.error('Error fetching package data:', error);
        return [];
    }
};

// import { Package } from "@/types/screens/Package/PackageType";
// import axios from "axios"; // Import axios directly

// const API_URL = 'https://rhcqs-be.onrender.com/api/v1/package?page=1&size=8';

// export const getPackages = async (): Promise<Package['Items']> => {
//     try {
//         // Perform a direct axios request
//         const response = await axios.get(API_URL);
//         console.log('Response data:', response.data);
        
//         // Ensure response.data.Items exists and is an array
//         return response.data.Items || [];
//     } catch (error) {
//         console.error('Error fetching package data:', error);
//         return [];
//     }
// };
