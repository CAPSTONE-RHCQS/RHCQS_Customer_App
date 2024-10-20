import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNav from './src/navigation/AppNav';
import AuthProvider from './src/context/AuthContext';
import store from './src/redux/strore/store';
import { Provider } from 'react-redux';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <AuthProvider>
        <Provider store={store}>
          <AppNav />
        </Provider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

export default App;