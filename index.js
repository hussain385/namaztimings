import { registerRootComponent } from 'expo';

import App from './app/App';
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-community/async-storage";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (remoteMessage.data.announcement) {
    await AsyncStorage.setItem('notification', 'true');
  }
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
