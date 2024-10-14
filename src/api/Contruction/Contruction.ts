import axiosInstance, { getHeaders } from '../../utils/axios';
import { Construction, Item } from '../../types/screens/Contruction/ContructionType';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getConstructionOption = async (): Promise<Construction['Items']> => {
  try {
    const cachedData = await AsyncStorage.getItem('constructionOptions');
    if (cachedData) {
      console.log('Using cached construction options');
      return JSON.parse(cachedData);
    }

    const headers = await getHeaders();
    const response = await axiosInstance.get('/construction?page=1&size=24', { headers });
    const items = response.data.Items;

    await AsyncStorage.setItem('constructionOptions', JSON.stringify(items));
    return items;
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
    const headers = await getHeaders();
    const apiUrl = `/construction/name?name=${encodeURIComponent(name)}`;
    console.log(`Calling API: ${apiUrl}`);

    const response = await axiosInstance.get<Item>(apiUrl, { headers });
    if (response.status === 200) {
      console.log(response.data);
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