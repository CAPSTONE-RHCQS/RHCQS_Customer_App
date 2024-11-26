export const pushSubTemplate = (subTemplateData: any) => {
    return {
        type: 'subTemplate',
        payload: subTemplateData,
    };
};

export const resetDataSubTemplate = () => {
    return {
        type: 'resetDataSubTempalte',
    };
};
