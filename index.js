/**
 * @format
 */

import messaging from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';

PushNotification.createChannel(
  {
    channelId: 'rhcqs',
    channelName: 'Default Channel',
    channelDescription: 'A default channel',
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  created => console.log(`createChannel returned '${created}'`),
);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  PushNotification.localNotification({
    channelId: 'rhcqs',
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
  });
});

messaging().onMessage(async remoteMessage => {
  PushNotification.localNotification({
    channelId: 'rhcqs',
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
  });
});

async function checkNotification() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted');
  } else {
    console.log('Notification permission not granted');
  }
}

checkNotification();

AppRegistry.registerComponent(appName, () => App);
