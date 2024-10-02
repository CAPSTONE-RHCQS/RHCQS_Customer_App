import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type AppStackParamList = {
  HomeScreen: undefined;
  ConstructionScreen: undefined;
  UltilitiesScreen: undefined;
  ElevatorTechnical: { Name: string };
  PIT: {Name: string};
};

export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>;