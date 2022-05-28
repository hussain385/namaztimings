import React, {createRef} from 'react';
import PushNotification from 'react-native-push-notification';

export const navigationRef = createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

function myNotification(title, message) {
  console.log(title, message);
  try {
    PushNotification.configure({
      //
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        console.log('Clicked on Notification');

        if (message !== 'Timings has been updated') {
          try {
            navigate('Announcement');
          } catch {
            console.log('No Route');
          }
        }
      },

      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },

      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    PushNotification.createChannel(
      {
        channelId: 'specialid', // (required)
        channelName: 'Special messasge', // (required)
        channelDescription: 'Notification for special message', // (optional) default: undefined.
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );

    console.log('Inside Notication function');
    PushNotification.localNotification({
      channelId: 'specialid', //his must be same with channelid in createchannel
      title: `${title}`,
      message: `${message}`,
    });
  } catch (e) {
    console.log(e);
  }
}

export default myNotification;
