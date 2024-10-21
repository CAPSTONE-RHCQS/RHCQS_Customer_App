interface BasementState {
    id: string;
    name: string;
    totalPrice: number;
    area: string;
    checkedItems: { [key: string]: number }
    coefficient: number;
}

const initialState: BasementState = {
    id: '',
    name: '',
    totalPrice: 0,
    area: '',
    checkedItems: {},
    coefficient: 0,
};

const basementSlice = (state: BasementState = initialState, action: any) => {
    switch (action.type) {
        case 'detailConstruction/basement':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}

export default basementSlice;

