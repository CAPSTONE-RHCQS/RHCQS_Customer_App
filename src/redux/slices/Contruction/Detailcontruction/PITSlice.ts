interface PITState {
    id: string;
    name: string;
    totalPrice: number;
    area: string;
    coefficient: number;
}

const initialState: PITState = {
    id: '',
    name: '',
    totalPrice: 0,
    area: '',
    coefficient: 0,
};

const PITSlice = (state: PITState = initialState, action: any) => {
    switch (action.type) {
        case 'detailConstruction/PIT':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}

export default PITSlice;

