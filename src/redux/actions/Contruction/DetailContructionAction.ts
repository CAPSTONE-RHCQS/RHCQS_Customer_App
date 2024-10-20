export const pushBasement = (dataBasement: any) => {
    return {
        type: 'construction/basement',
        payload: dataBasement,
    };
};

export const pushStereobate = (dataStereobate: any) => {
    return {
        type: 'construction/stereobate',
        payload: dataStereobate,
    };
};
