interface PackageState {
  selectedRough: string | null;
  selectedRoughType: string | null;
  selectedComplete: string | null;
  selectedCompleteType: string | null;
  roughPackageName: string | null; 
  completePackageName: string | null; 
  roughPackagePrice: number;
  completePackagePrice: number;
}

const initialState: PackageState = {
  selectedRough: null,
  selectedRoughType: null,
  selectedComplete: null,
  selectedCompleteType: null,
  roughPackageName: null, 
  completePackageName: null,
  roughPackagePrice: 0,
  completePackagePrice: 0,
};

const packageSlice = (state: PackageState = initialState, action: any) => {
  switch (action.type) {
    case 'package':
      return {
        ...state,
        ...action.payload,
      };
    case 'resetDataPackage':
      return initialState;
    default:
      return state;
  }
};

export default packageSlice;
