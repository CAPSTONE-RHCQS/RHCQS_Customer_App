import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNav from './src/navigation/AppNav';
import AuthProvider from './src/context/AuthContext';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

export default App;