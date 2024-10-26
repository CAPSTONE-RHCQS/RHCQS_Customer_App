interface SubTemplateState {
    subTemplateId: string;
}

const initialState: SubTemplateState = {
    subTemplateId: '',
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
