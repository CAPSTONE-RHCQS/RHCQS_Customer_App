interface ConstructionState {
    constructionArea: string;
    checkedItems: string[];
    totalPrice: number;
}

const initialState: ConstructionState = {
    constructionArea: '',
    checkedItems: [],
    totalPrice: 0,
};

const resetContructionDataSlice = (state: ConstructionState = initialState, action: any) => {
    switch (action.type) {
        case 'resetDataConstruction':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

export default resetContructionDataSlice;
