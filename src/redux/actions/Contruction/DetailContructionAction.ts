export const pushBasement = (dataBasement: any) => {
    return {
        type: 'detailConstruction/basement',
        payload: dataBasement,
    };
};

export const pushStereobate = (dataStereobate: any) => {
    return {
        type: 'detailConstruction/stereobate',
        payload: dataStereobate,
    };
};
