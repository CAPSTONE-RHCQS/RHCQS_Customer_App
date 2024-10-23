interface DetailConstruction {
  id: string;
  name: string;
  totalPrice: number;
  area?: string;
  checkedItemName?: string;
  checkedItems?: string;
  coefficient: number;
}

const initialState = {
  detailUltilities: [] as DetailConstruction[],
};

const detailUltilitiesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'detailUltilities':
      const updatedDetailUltilities = state.detailUltilities.map(item =>
        item.id === action.payload.id ? {...item, ...action.payload} : item,
      );

      const isUpdated = updatedDetailUltilities.some(
        item => item.id === action.payload.id,
      );

      return {
        ...state,
        detailUltilities: isUpdated
          ? updatedDetailUltilities
          : [...state.detailUltilities, action.payload],
      };
    default:
      return state;
  }
};

export default detailUltilitiesReducer;
