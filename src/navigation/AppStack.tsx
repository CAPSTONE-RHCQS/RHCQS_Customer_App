import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/TypeScreen';
import TabNavigation from './TabNavigation';
import UltilitiesScreen from '../screens/InitialQuotationScreen/UltilitiesScreen';
import ConstructionScreen from '../screens/InitialQuotationScreen/ConstructionScreen';
import ConstructionStack from './ContrutionDetailStack';


const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={TabNavigation} />
      <Stack.Screen name="ConstructionScreen" component={ConstructionScreen} />
      <Stack.Screen name="UltilitiesScreen" component={UltilitiesScreen} />
      <Stack.Screen name="ConstructionStack" component={ConstructionStack} /> 
    </Stack.Navigator>
  );
};

export default AppStack;