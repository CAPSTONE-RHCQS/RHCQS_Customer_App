interface BasementState {
    name: string;
    totalPriceBasement: number;
    areaBasement: string;
    checkedItems: { [key: string]: number }
    coefficient: number;
}

const initialState: BasementState = {
    name: '',
    totalPriceBasement: 0,
    areaBasement: '',
    checkedItems: {},
    coefficient: 0,
};

const basementSlice = (state: BasementState = initialState, action: any) => {
    switch (action.type) {
        case 'construction/basement':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}

export default basementSlice;

