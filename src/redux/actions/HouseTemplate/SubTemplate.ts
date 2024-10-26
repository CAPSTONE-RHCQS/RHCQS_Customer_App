export const pushSubTemplate = (subTemplateData: any) => {
    return {
        type: 'subTemplate',
        payload: subTemplateData,
    };
};
