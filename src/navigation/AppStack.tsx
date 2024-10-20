import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/TypeScreen';
import TabNavigation from './TabNavigation';
import UltilitiesScreen from '../screens/InitialQuotationScreen/UltilitiesScreen';
import ConstructionScreen from '../screens/InitialQuotationScreen/ConstructionScreen';
import ConstructionStack from './ContrutionDetailStack';
import Package from '../screens/Package/Package';
import HouseLibrary from '../screens/HouseDesginTemplate/HouseLibrary';
import UltilitiesStack from './UltilitiesDetailStack';


const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={TabNavigation} />
      <Stack.Screen name="ConstructionScreen" component={ConstructionScreen} />
      <Stack.Screen name="UltilitiesScreen" component={UltilitiesScreen} />
      <Stack.Screen name="UltilitiesStack" component={UltilitiesStack} />
      <Stack.Screen name="ConstructionStack" component={ConstructionStack} /> 
      <Stack.Screen name="Package" component={Package} />
      <Stack.Screen name="HouseLibrary" component={HouseLibrary} />
    </Stack.Navigator>
  );
};

export default AppStack;