interface SubTemplateState {
    subTemplateId: string;
    area: number;
    totalRough: number;
    totalFinished: number;
    totalPrice: number;
}

const initialState: SubTemplateState = {
    subTemplateId: '',
    area: 0,
    totalRough: 0,
    totalFinished: 0,
    totalPrice: 0,
};

const subTemplateSlice = (state: SubTemplateState = initialState, action: any) => {
    switch (action.type) {
        case 'subTemplate':
            return {
                ...state,
                ...action.payload
            };
        case 'resetDataSubTempalte':
            return initialState;
        default:
            return state;
    }
};

export default subTemplateSlice;
