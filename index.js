/**
 * @format
 */

import messaging from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Đăng ký trình xử lý thông báo nền
messaging().setBackgroundMessageHandler(async remoteMessage => {
});

AppRegistry.registerComponent(appName, () => App);
