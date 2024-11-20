import axiosInstance from '../../utils/axios';
import { getHeaders } from '../../utils/axios';

export const createProjectHaveDesign = async (projectData: any) => {
    try {
        const headers = await getHeaders();
        headers['Content-Type'] = 'multipart/form-data';

        const formData = new FormData();
        formData.append('ProjectId', projectData.ProjectId);

        projectData.PerspectiveImage.forEach((image: string) => {
            formData.append('PerspectiveImage', {
                uri: image,
                type: 'image/png',
                name: image.split('/').pop(),
            } as any);
        });

        projectData.ArchitectureImage.forEach((image: string) => {
            formData.append('ArchitectureImage', {
                uri: image,
                type: 'image/png',
                name: image.split('/').pop(),
            } as any);
        });

        projectData.StructureImage.forEach((image: string) => {
            formData.append('StructureImage', {
                uri: image,
                type: 'image/png',
                name: image.split('/').pop(),
            } as any);
        });

        projectData.ElectricityWaterImage.forEach((image: string) => {
            formData.append('ElectricityWaterImage', {
                uri: image,
                type: 'image/png',
                name: image.split('/').pop(),
            } as any);
        });

        const response = await axiosInstance.post('/project/drawing-have', formData, { headers });
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};
