interface StereobateState {
    name: string;
    totalPriceStereobate: number;
    areaStereobate: string;
    checkedItems: { [key: string]: boolean };
    coefficient: number;
}

const initialState: StereobateState = {
    name: '',
    totalPriceStereobate: 0,
    areaStereobate: '',
    checkedItems: {},
    coefficient: 0,
};

const stereobateSlice = (state: StereobateState = initialState, action: any) => {
    switch (action.type) {
        case 'construction/stereobate':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}

export default stereobateSlice;

