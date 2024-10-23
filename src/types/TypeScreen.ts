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
  DetailUltilities: { Id: string };
  UltilitiesStack: { screen: keyof UltilitiesStackParamList; params: { Id: string } };
  Package: undefined;
  HouseLibrary: undefined;
  ConfirmInformation: undefined;
  DetailContruction: { Name: string };
  // History
  HistoryScreen: undefined;
  TrackingScreen: {projectId: string};
  VersionScreen: {projectId: string};
  VersionDetail: {projectId: string, version: string};
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
// Detail Ultilities
export type UltilitiesStackNavigationProp = NativeStackNavigationProp<UltilitiesStackParamList>;