import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {navigate} from '../push';

export const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log(fcmToken, 'the old token');
  if (!fcmToken) {
    try {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken, 'Generated new token');
        await saveToken(fcmToken);
      }
    } catch (error) {
      console.log(error, 'error raised in fcmToken');
    }
  }
  return fcmToken;
};

export const saveToken = async fcmToken => {
  console.log('saving token ', fcmToken);
  await AsyncStorage.setItem('fcmToken', fcmToken);
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    navigate('Announcement');
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
    });
};
