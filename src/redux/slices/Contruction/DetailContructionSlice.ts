interface DetailConstruction {
  id: string;
  name: string;
  totalPrice: number;
  area: string;
  checkedItemName?: string;
  checkedItems?: string;
  coefficient: number;
}

const initialState = {
  detailConstructions: [] as DetailConstruction[],
};

const detailContructionReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'detailConstruction':
      const updatedDetailConstructions = state.detailConstructions.map(item =>
        item.id === action.payload.id ? { ...item, ...action.payload } : item
      );

      const isUpdated = updatedDetailConstructions.some(
        item => item.id === action.payload.id
      );

      return {
        ...state,
        detailConstructions: isUpdated
          ? updatedDetailConstructions
          : [...state.detailConstructions, action.payload],
      };
    case 'resetDataDetailConstruction':
      return initialState;
    default:
      return state;
  }
};

export default detailContructionReducer;
