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

const constructionSlice = (state: ConstructionState = initialState, action: any) => {
    switch (action.type) {
        case 'construction':
            return {
                ...state,
                ...action.payload
            };
        case 'resetDataConstruction':
            return initialState;
        default:
            return state;
    }
};

export default constructionSlice;
