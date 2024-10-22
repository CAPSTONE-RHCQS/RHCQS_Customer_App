import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type AppStackParamList = {
  // Home
  HomeScreen: undefined;
  // Initial Quotation
  ConstructionScreen: undefined;
  UltilitiesScreen: undefined;
  UltilitiesStack: { screen: keyof UltilitiesStackParamList; params: { Id: string } };
  ConstructionStack: { screen: keyof ConstructionStackParamList; params: { Name: string } };
  Package: undefined;
  HouseLibrary: undefined;
  ConfirmInformation: undefined;
  // History
  HistoryScreen: undefined;
  TrackingScreen: {projectId: string};
  VersionScreen: {projectId: string};
  VersionDetail: {projectId: string, version: string};
};

// Detail Construction
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

// Detail Ultilities
export type UltilitiesStackParamList = {
  NarrowAlleyConstructionCost: { Id: string };
  SmallAreaConstructionCost: { Id: string };
};

// Auth
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
// App
export type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>;
// Detail Construction
export type ConstructionStackNavigationProp = NativeStackNavigationProp<ConstructionStackParamList>;
// Detail Ultilities
export type UltilitiesStackNavigationProp = NativeStackNavigationProp<UltilitiesStackParamList>;