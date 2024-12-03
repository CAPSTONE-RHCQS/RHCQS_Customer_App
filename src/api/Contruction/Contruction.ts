import axiosInstance, { getHeaders } from '../../utils/axios';
import { Construction, Item } from '../../types/screens/Contruction/ContructionType';
import axios from 'axios';

export const getConstructionOption = async (): Promise<Construction['Items']> => {
  try {
    const headers = await getHeaders();
    const response = await axiosInstance.get('/construction/type?type=ALL', {
      headers,
    });
    const items = response.data;
    if (Array.isArray(items)) {
      return items;
    } else {
      console.error('Items is not an array:', items);
      return [];
    }
  } catch (error) {
    console.error('Error fetching construction data:', error);
    return [];
  }
};

// export const getConstructionByName = async (name: string): Promise<Item | null> => {
//   if (!name) {
//     console.error("Name is empty or undefined");
//     return null;
//   }
//   try {
//     const headers = await getHeaders();
//     const apiUrl = `/construction/name?name=${encodeURIComponent(name)}`;

//     const response = await axiosInstance.get<Item>(apiUrl, { headers });
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       console.error(`Error fetching construction data: HTTP ${response.status}`);
//       return null;
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error(`Error fetching construction data for name "${name}":`, error.response?.data || error.message);
//     } else {
//       console.error(`Unexpected error:`, error);
//     }
//     return null;
//   }
// };

export const getConstructionById = async (id: string): Promise<Item | null> => {
  if (!id) {
    console.error("Id is empty or undefined");
    return null;
  }
  try {
    const headers = await getHeaders();
    const apiUrl = `/construction/id?id=${id}`;

    const response = await axiosInstance.get<Item>(apiUrl, { headers });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error fetching construction data: HTTP ${response.status}`);
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching construction data for id "${id}":`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error:`, error);
    }
    return null;
  }
};
