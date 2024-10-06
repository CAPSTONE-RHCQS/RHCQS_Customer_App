import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type AppStackParamList = {
  HomeScreen: undefined;
  ConstructionScreen: { totalPrice: number, area: string };
  UltilitiesScreen: undefined;
  ConstructionStack: { screen: keyof ConstructionStackParamList; params: { Name: string } };
};

export type ConstructionStackParamList = {
  // Construction
  ElevatorTechnical: { Name: string };
  PIT: { Name: string };
  Yard: { Name: string };
  Basement: { Name: string };
  GroundFloor: { Name: string };
  Mezzanine: { Name: string };
  MezzanineVoid: { Name: string };
  OpenRooftop: { Name: string };
  Rooftop: { Name: string };
  Stereobate: { Name: string };
  Roof: { Name: string };
  SubRoof: { Name: string };
  // Construction Floor
  FirstFloor: { Name: string };
  SecondFloor: { Name: string };
  ThirdFloor: { Name: string };
  FourthFloor: { Name: string };
  FifthFloor: { Name: string };
  SixthFloor: { Name: string };
  // Construction Floor Void
  FirstFloorVoid: { Name: string };
  SecondFloorVoid: { Name: string };
  ThirdFloorVoid: { Name: string };
  FourthFloorVoid: { Name: string };
  FifthFloorVoid: { Name: string };
  SixthFloorVoid: { Name: string };
};

export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>;
export type ConstructionStackNavigationProp = NativeStackNavigationProp<ConstructionStackParamList>;