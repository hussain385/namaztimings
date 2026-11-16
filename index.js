import { registerRootComponent } from "expo"

import App from "./app/App"
import messaging from "@react-native-firebase/messaging"
import { storage } from "./app/redux/store"

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (remoteMessage.data.announcement) {
    storage.set("notification", true)
  }
})

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
