import { combineReducers } from 'redux';
import basementSlice from './BasementSlice';
import stereobateSlice from './StereobateSlice';
import elevatorTechnicalSlice from './ElevatorTechnicalSlice';


const DetailConstructionSlice = combineReducers({
  basement: basementSlice,
  stereobate: stereobateSlice,
  elevatorTechnical: elevatorTechnicalSlice,
});

export default DetailConstructionSlice;


