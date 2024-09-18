import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type AppStackParamList = {
  
}

export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
