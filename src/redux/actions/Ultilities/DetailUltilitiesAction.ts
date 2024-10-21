export const pushNarrowAlley = (dataNarrowAlley: any) => {
    return {
        type: 'detailUltilities/narrowAlley',
        payload: dataNarrowAlley,
    };
};

export const pushSmallArea = (dataSmallArea: any) => {
    return {
        type: 'detailUltilities/smallArea',
        payload: dataSmallArea,
    };
};
