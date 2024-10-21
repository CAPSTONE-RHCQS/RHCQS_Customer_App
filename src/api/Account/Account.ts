import { Profile } from "../../types/Account/AccountType";
import axiosInstance, { getHeaders } from "../../utils/axios";

export const getProfile = async (): Promise<Profile> => {

    const headers = await getHeaders();
    const response = await axiosInstance.get('/account/profile', { headers });
    return response.data;
};