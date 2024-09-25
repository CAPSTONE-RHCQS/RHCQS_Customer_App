import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';

function App(): React.JSX.Element {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppStack/>
        {/* <AuthStack/> */}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;