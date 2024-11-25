interface SubTemplateState {
    subTemplateId: string;
    totalRough: number;
}

const initialState: SubTemplateState = {
    subTemplateId: '',
    totalRough: 0,
};

const subTemplateSlice = (state: SubTemplateState = initialState, action: any) => {
    switch (action.type) {
        case 'subTemplate':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

export default subTemplateSlice;
