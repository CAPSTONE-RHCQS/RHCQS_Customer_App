interface StereobateState {
    id: string;
    name: string;
    totalPrice: number;
    area: string;
    checkedItemName: string;
    checkedItems: { [key: string]: boolean };
    coefficient: number;
}

const initialState: StereobateState = {
    id: '',
    name: '',
    totalPrice: 0,
    area: '',
    checkedItemName: '',
    checkedItems: {},
    coefficient: 0,
};

const stereobateSlice = (state: StereobateState = initialState, action: any) => {
    switch (action.type) {
        case 'detailConstruction/stereobate':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}

export default stereobateSlice;

