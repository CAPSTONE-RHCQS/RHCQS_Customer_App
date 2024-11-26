import { combineReducers } from 'redux';
import packageSlice from '../slices/Package/PackageSlice';
import constructionSlice from '../slices/Contruction/ConstructionSlice';
import ultitlitiesSlice from '../slices/Ultilities/UltitlitiesSlice';
import detailContructionReducer from '../slices/Contruction/DetailContructionSlice';
import detailUltilitiesReducer from '../slices/Ultilities/UltilitiesDetail';
import subTemplateSlice from '../slices/HouseTemplate/SubTemplate';
import { resetDataConstruction, resetDataDetailConstruction, resetDataDetailUltilities, resetDataPackage, resetDataUltilities } from '../actions/reset/resetData';
import promotionSlice from '../slices/Promotion/Promotion';
import { resetDataSubTemplate } from '../actions/HouseTemplate/SubTemplate';

const rootReducer = combineReducers({
  // Contruction
  construction: constructionSlice,
  detailContruction: detailContructionReducer,
  resetDataConstruction: resetDataConstruction,
  resetDataDetailConstruction: resetDataDetailConstruction,
  // Ultilities
  ultilities: ultitlitiesSlice,
  detailUltilities: detailUltilitiesReducer,
  resetDataUltilities: resetDataUltilities,
  resetDataDetailUltilities: resetDataDetailUltilities,
  // Package
  package: packageSlice,
  resetDataPackage: resetDataPackage,
  // House Template
  subTemplate: subTemplateSlice,
  resetDataSubTemplate: resetDataSubTemplate,
  // Promotion
  promotion: promotionSlice,
});

export default rootReducer;