import { combineReducers } from 'redux';
import packageSlice from '../slices/Package/PackageSlice';
import constructionSlice from '../slices/Contruction/ConstructionSlice';
import DetailUltilitiesSlice from '../slices/Ultilities/DetailUltilities/_DetailUltilitiesSlice';
import ultitlitiesSlice from '../slices/Ultilities/UltitlitiesSlice';
import detailContructionReducer from '../slices/Contruction/DetailContructionSlice';
const rootReducer = combineReducers({
  construction: constructionSlice,
  ultilities: ultitlitiesSlice,
  package: packageSlice,
  detailUltilities: DetailUltilitiesSlice,
  detailContruction: detailContructionReducer,
});

export default rootReducer;