import axios from 'axios';

export const uploadImage = async (imageUri: string) => {
    const formData = new FormData();
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const fileType = imageUri.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const fileName = imageUri.split('/').pop();

    formData.append("AccountImage", {
        uri: imageUri,
        type: fileType,
        name: fileName,
    } as any);

    try {
        const response = await axios.post(
            "https://rhqs-fzbda8gefsh7bnft.southeastasia-01.azurewebsites.net/api/v1/upload-profile-images",
            formData,
            {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjA4YjEwZmY1LWUzN2QtNDBiZi05NDdjLTgwY2JmNzhmYTQxMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJoZWhlQm9penp6eiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiMDg2OTMzNzc3NyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkN1c3RvbWVyIiwiSW1nVXJsIjoiIiwiZXhwIjoxNzMyNDg4OTk5fQ.KSP-D7IE24LTDA-cxDzI-wGdfBx9K9DMo_TY4WMnxPk',
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        console.log("Response from API:", response.data);
        return response.data.url;
    } catch (error) {
        throw error;
    }
};
