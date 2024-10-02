import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { AuthContext } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

const AppNav = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null; // Prevent app from crashing if context is not available
  }

  const { userToken, isLoading } = authContext;

  // Show loading indicator while loading user token
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNav;
