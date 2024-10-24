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
  Package: undefined;

  ConfirmInformation: undefined;
  DetailContruction: { Name: string };
  // History
  HistoryScreen: undefined;
  TrackingScreen: {projectId: string};
  VersionScreen: {projectId: string};
  VersionDetail: {projectId: string, version: string};
  // House Library
  HouseLibrary: undefined;
};

// Auth
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
// App
export type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>;
