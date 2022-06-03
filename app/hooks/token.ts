import messaging from '@react-native-firebase/messaging';
import {storage} from '../redux/store';

export const getFcmToken = async () => {
  let fcmToken = storage.getString('fcmToken');
  console.log(fcmToken, 'the old token');
  if (!fcmToken) {
    try {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken, 'Generated new token');
        saveToken(fcmToken);
      }
    } catch (error) {
      console.log(error, 'error raised in fcmToken');
    }
  }
  return fcmToken;
};

export const saveToken = (fcmToken: string | number | boolean) => {
  console.log('saving token ', fcmToken);
  storage.set('fcmToken', fcmToken);
};

// export const notificationListener = async () => {
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     navigate('Announcement');
//   });
//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         console.log(
//           'Notification caused app to open from quit state:',
//           remoteMessage.notification,
//         );
//         // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
//       }
//     });
// };
