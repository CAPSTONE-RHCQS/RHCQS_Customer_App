interface PromotionState {
    promotionId: string;
    discount: number;
}

const initialState: PromotionState = {
    promotionId: '',
    discount: 0,
};

const promotionSlice = (state: PromotionState = initialState, action: any) => {
    switch (action.type) {
        case 'promotion':
            return { ...state, ...action.payload };
        case 'resetDataPromotion':
            return initialState;
        default:
            return state;
    }
};

export default promotionSlice;

