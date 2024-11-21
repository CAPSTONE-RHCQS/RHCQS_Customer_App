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
  HasDesignScreen: { projectId: string };
  ConfirmInformation: undefined;
  DetailContruction: { Name: string };
  // History
  HistoryScreen: undefined;
  TrackingScreen: { projectId: string };
  VersionScreen: { projectId: string };
  VersionDetail: { projectId: string, version: string };
  VersionFinalScreen: { projectId: string };
  VersionFinalDetail: { projectId: string, version: string };
  //Contact
  ContactDesignScreen: { projectId: string };
  TrackingDesignContact: { projectId: string };
  DetailVersionDesign: { versionId: string, projectId: string };
  TrackingVersionDesign: { projectId: string };
  ContactContructionScreen: { projectId: string };
  TrackingContruction: { projectId: string };
  // House Library
  HouseLibrary: undefined;
  HouseExternalView: { houseId: string, name: string };
  HouseResidentialArea: { houseId: string, name: string };
  HousePackageTemplate: { houseId: string };
  UltilitiesHouse: undefined;
  ConfirmInformationHouseTemplate: undefined;
  DetailUltilitiesHouse: { Id: string };
  // Blog
  BlogList: undefined;
  BlogDetail: { id: string, heading: string };

  //Chat
  ChatScreen: undefined;

};

// Auth
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
// App
export type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>;
