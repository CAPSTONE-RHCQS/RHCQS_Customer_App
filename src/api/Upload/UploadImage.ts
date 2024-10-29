import axios from 'axios';

export const uploadImage = async (imageUri: string) => {
    const formData = new FormData();
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const fileType = imageUri.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const fileName = imageUri.split('/').pop();

    formData.append("file", {
        uri: imageUri,
        type: fileType,
        name: fileName,
    } as any);

    try {
        const response = await axios.post(
            "https://rhqs-fzbda8gefsh7bnft.southeastasia-01.azurewebsites.net/api/UploadImage/api/upload",
            formData,
        );
        console.log("Response from API:", response.data);
        return response.data.url;
    } catch (error) {
        throw error;
    }
};
