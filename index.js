/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './app/App';

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

AppRegistry.registerComponent('main', () => App);
