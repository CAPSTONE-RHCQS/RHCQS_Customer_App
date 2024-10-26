import { combineReducers } from 'redux';
import packageSlice from '../slices/Package/PackageSlice';
import constructionSlice from '../slices/Contruction/ConstructionSlice';
import ultitlitiesSlice from '../slices/Ultilities/UltitlitiesSlice';
import detailContructionReducer from '../slices/Contruction/DetailContructionSlice';
import detailUltilitiesReducer from '../slices/Ultilities/UltilitiesDetail';
import subTemplateSlice from '../slices/HouseTemplate/SubTemplate';

const rootReducer = combineReducers({
  // Contruction
  construction: constructionSlice,
  detailContruction: detailContructionReducer,
  // Ultilities
  ultilities: ultitlitiesSlice,
  detailUltilities: detailUltilitiesReducer,
  // Package
  package: packageSlice,
  // House Template
  subTemplate: subTemplateSlice,
});

export default rootReducer;