import { combineReducers } from 'redux';
import packageSlice from '../slices/Package/PackageSlice';
import DetailConstructionSlice from '../slices/Contruction/Detailcontruction/_DetailContructionSlice';
import constructionSlice from '../slices/Contruction/ConstructionSlice';
import DetailUltilitiesSlice from '../slices/Ultilities/DetailUltilities/_DetailUltilitiesSlice';
import ultitlitiesSlice from '../slices/Ultilities/UltitlitiesSlice';

const rootReducer = combineReducers({
  construction: constructionSlice,
  ultilities: ultitlitiesSlice,
  package: packageSlice,
  detailConstruction: DetailConstructionSlice,
  detailUltilities: DetailUltilitiesSlice,
});

export default rootReducer;