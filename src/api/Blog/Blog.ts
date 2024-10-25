import { Blog } from '../../types/screens/Blog/BlogType';
import axiosInstance, { getHeaders } from '../../utils/axios';


export const getBlog = async (): Promise<Blog[]> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get('/listblog', {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching construction data:', error);
        throw error;
    }
};

export const getBlogDetail = async (id: string): Promise<Blog> => {
    try {
        const headers = await getHeaders();
        const response = await axiosInstance.get(`/blogs/id?id=${id}`, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching blog detail:', error);
        throw error;
    }
};
