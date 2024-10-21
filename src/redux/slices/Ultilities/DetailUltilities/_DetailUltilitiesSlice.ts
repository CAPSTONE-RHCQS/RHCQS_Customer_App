import { combineReducers } from "redux";
import narrowAlleySlice from "./NarrowAlleyConstructionCost";
import smallAreaSlice from "./SmallAreaConstructionCost";

const DetailUltilitiesSlice = combineReducers({
  narrowAlley: narrowAlleySlice,
  smallArea: smallAreaSlice,
});

export default DetailUltilitiesSlice;
