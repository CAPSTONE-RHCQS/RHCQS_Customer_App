import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppStackParamList} from '../types/TypeScreen';
import TabNavigation from './TabNavigation';
import UltilitiesScreen from '../screens/InitialQuotationScreen/UltilitiesScreen';
import ConstructionScreen from '../screens/InitialQuotationScreen/ConstructionScreen';
import ElevatorTechnicalScreen from '../screens/InitialQuotationScreen/DetailConstruction/ElevatorTechnical';
import PIT from '../screens/InitialQuotationScreen/DetailConstruction/PIT';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={TabNavigation} />
      <Stack.Screen name="ConstructionScreen" component={ConstructionScreen} />
      <Stack.Screen name="UltilitiesScreen" component={UltilitiesScreen} />
      <Stack.Screen name="ElevatorTechnical" component={ElevatorTechnicalScreen}/>
      <Stack.Screen name="PIT" component={PIT}/>
    </Stack.Navigator>
  );
};

export default AppStack;
