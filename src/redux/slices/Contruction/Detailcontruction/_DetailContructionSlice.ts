import { combineReducers } from 'redux';
import basementSlice from './BasementSlice';
import stereobateSlice from './StereobateSlice';

const DetailConstructionSlice = combineReducers({
  basement: basementSlice,
  stereobate: stereobateSlice,
});

export default DetailConstructionSlice;


