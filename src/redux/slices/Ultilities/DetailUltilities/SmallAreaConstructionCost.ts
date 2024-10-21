interface NarrowAlleyState {
    id: string;
    name: string;
    totalPrice: number;
    checkedItems: { [key: string]: boolean };
}

const initialState: NarrowAlleyState = {
    id: '',
    name: '',
    totalPrice: 0,
    checkedItems: {},
};

const smallAreaSlice = (state: NarrowAlleyState = initialState, action: any): NarrowAlleyState => {
    switch (action.type) {
        case 'detailUltilities/smallArea':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}

export default smallAreaSlice;
