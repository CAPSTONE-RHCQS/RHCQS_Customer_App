interface UltilitiesState {
    checkedItems: string[];
}

const initialState: UltilitiesState = {
    checkedItems: [],
};

const ultitlitiesSlice = (state: UltilitiesState = initialState, action: any) => {
    switch (action.type) {
        case 'ultilities':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}

export default ultitlitiesSlice;
