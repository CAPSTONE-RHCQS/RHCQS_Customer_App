import basementSlice from "./Detailcontruction/BasementSlice";
import stereobateSlice from "./Detailcontruction/StereobateSlice";
import { combineReducers } from 'redux';


const constructionSlice = combineReducers({
    basement: basementSlice,
    stereobate: stereobateSlice,
});

export default constructionSlice;


