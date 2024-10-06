import axiosInstance, { setAuthToken } from '../../utils/axios';
import { Construction, Item } from '../../types/screens/Contruction/ContructionType';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getConstructionOption = async (): Promise<Construction['Items']> => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '', 
    };

    const response = await axiosInstance.get('/construction?page=1&size=24', { headers });
    console.log('Response data:', response.data.Page + ' ' + response.data.TotalPages);
    return response.data.Items;
  } catch (error) {
    console.error('Error fetching construction data:', error);
    return [];
  }
};

export const getConstructionByName = async (name: string): Promise<Item | null> => {
  if (!name) {
    console.error("Name is empty or undefined");
    return null;
  }

  try {
    const token = await AsyncStorage.getItem('accessToken');
    const apiUrl = `/construction/name?name=${encodeURIComponent(name)}`;
    console.log(`Calling API: ${apiUrl}`);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axiosInstance.get<Item>(apiUrl, { headers });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error fetching construction data: HTTP ${response.status}`);
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching construction data for name "${name}":`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error:`, error);
    }
    return null;
  }
};
