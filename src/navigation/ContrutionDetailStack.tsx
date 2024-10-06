import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ElevatorTechnical,
  PIT,
  Yard,
  Basement,
  GroundFloor,
  Mezzanine,
  MezzanineVoid,
  OpenRooftop,
  Rooftop,
  Stereobate,
  Roof,
  SubRoof,
  FifthFloor,
  FirstFloor,
  FirstFloorVoid,
  FourthFloor,
  SecondFloor,
  SixthFloor,
  ThirdFloor,
  ThirdFloorVoid,
  SecondFloorVoid,
  FifthFloorVoid,
  SixthFloorVoid,
} from '../screens/InitialQuotationScreen/DetailConstruction/@index';
import { ConstructionStackParamList } from '../types/TypeScreen';

const Stack = createNativeStackNavigator<ConstructionStackParamList>();

const ConstructionStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ElevatorTechnical" component={ElevatorTechnical} />
      <Stack.Screen name="PIT" component={PIT} />
      <Stack.Screen name="Yard" component={Yard} />
      <Stack.Screen name="Basement" component={Basement} />
      <Stack.Screen name="GroundFloor" component={GroundFloor} />
      <Stack.Screen name="Mezzanine" component={Mezzanine} />
      <Stack.Screen name="MezzanineVoid" component={MezzanineVoid} />
      <Stack.Screen name="OpenRooftop" component={OpenRooftop} />
      <Stack.Screen name="Rooftop" component={Rooftop} />
      <Stack.Screen name="Stereobate" component={Stereobate} />
      <Stack.Screen name="Roof" component={Roof} />
      <Stack.Screen name="SubRoof" component={SubRoof} />
      <Stack.Screen name="FirstFloor" component={FirstFloor} />
      <Stack.Screen name="SecondFloor" component={SecondFloor} />
      <Stack.Screen name="ThirdFloor" component={ThirdFloor} />
      <Stack.Screen name="FourthFloor" component={FourthFloor} />
      <Stack.Screen name="FifthFloor" component={FifthFloor} />
      <Stack.Screen name="SixthFloor" component={SixthFloor} />
      <Stack.Screen name="FirstFloorVoid" component={FirstFloorVoid} />
      <Stack.Screen name="SecondFloorVoid" component={SecondFloorVoid} />
      <Stack.Screen name="ThirdFloorVoid" component={ThirdFloorVoid} />
      <Stack.Screen name="FifthFloorVoid" component={FifthFloorVoid} />
      <Stack.Screen name="SixthFloorVoid" component={SixthFloorVoid} />
    </Stack.Navigator>
  );
};

export default ConstructionStack;