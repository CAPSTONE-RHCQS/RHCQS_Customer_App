export const getBasement = (state: any) => state.detailConstruction.basement;
export const getStereobate = (state: any) => state.detailConstruction.stereobate;

export const DetailContructionSelector = [getBasement, getStereobate];
