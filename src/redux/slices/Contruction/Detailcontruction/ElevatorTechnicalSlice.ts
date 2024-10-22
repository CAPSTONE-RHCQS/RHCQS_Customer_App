interface ElevatorTechnicalState {
    id: string;
    name: string;
    totalPrice: number;
    area: string;
    coefficient: number;
}

const initialState: ElevatorTechnicalState = {
    id: '',
    name: '',
    totalPrice: 0,
    area: '',
    coefficient: 0,
};

const elevatorTechnicalSlice = (state: ElevatorTechnicalState = initialState, action: any) => {
    switch (action.type) {
        case 'detailConstruction/elevatorTechnical':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}

export default elevatorTechnicalSlice;

