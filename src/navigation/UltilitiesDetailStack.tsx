import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UltilitiesStackParamList} from '../types/TypeScreen';
import NarrowAlleyConstructionCost from '../screens/InitialQuotationScreen/DetailUltilities/NarrowAlleyConstructionCost';

const Stack = createNativeStackNavigator<UltilitiesStackParamList>();

const UltilitiesStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NarrowAlleyConstructionCost" component={NarrowAlleyConstructionCost} />
    </Stack.Navigator>
  );
};

export default UltilitiesStack;
