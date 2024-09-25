import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppStackParamList } from '../types/TypeScreen';
import TabNavigation from './TabNavigation';
import LandAreaScreen from '../screens/InitialQuotationScreen/LandAreaScreen';
import UltilitiesScreen from '../screens/InitialQuotationScreen/UltilitiesScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={TabNavigation} />
      <Stack.Screen name="LandAreaScreen" component={LandAreaScreen} />
      <Stack.Screen name='UltilitiesScreen' component={UltilitiesScreen}/>
    </Stack.Navigator>
  );
};

export default AppStack;
