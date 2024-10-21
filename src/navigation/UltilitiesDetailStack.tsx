import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UltilitiesStackParamList} from '../types/TypeScreen';
import NarrowAlleyConstructionCost from '../screens/InitialQuotationScreen/DetailUltilities/NarrowAlleyConstructionCost';
import SmallAreaConstructionCost from '../screens/InitialQuotationScreen/DetailUltilities/SmallAreaConstructionCost';
const Stack = createNativeStackNavigator<UltilitiesStackParamList>();

const UltilitiesStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="NarrowAlleyConstructionCost" component={NarrowAlleyConstructionCost} />
      <Stack.Screen name="SmallAreaConstructionCost" component={SmallAreaConstructionCost} />
    </Stack.Navigator>
  );
};

export default UltilitiesStack;
