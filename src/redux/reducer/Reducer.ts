import constructionSlice from "../slices/Contruction/ConstructionSlice";
import { combineReducers } from 'redux';
import packageSlice from "../slices/Package/PackageSlice";

const rootReducer = combineReducers({
   construction: constructionSlice, 
   package: packageSlice,
});

export default rootReducer;