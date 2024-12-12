import {Profile} from '../../types/Account/AccountType';
import axiosInstance, {getHeaders} from '../../utils/axios';
import {UpdateProfile} from '../../types/Account/AccountType';

export const updateProfile = async (
  id: string,
  data: UpdateProfile,
): Promise<Profile> => {
  const headers = await getHeaders();
  const response = await axiosInstance.put(`/account/profile?id=${id}`, data, {
    headers,
  });
  return response.data;
};

export const updateImageProfile = async (formData: FormData): Promise<any> => {
  const headers = await getHeaders();
  const response = await axiosInstance.post('/upload-profile-images', formData, {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getProfile = async (): Promise<Profile> => {
  const headers = await getHeaders();
  const response = await axiosInstance.get('/account/profile', {headers});
  return response.data;
};
