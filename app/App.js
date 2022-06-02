import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import myNotification, { navigate, navigationRef } from "./components/notification/push";
import { Provider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./redux/store";
import { ToastProvider, useToast } from "react-native-toast-notifications";
import messaging from "@react-native-firebase/messaging";
import { saveToken } from "./store/token";
import Announcement from "./views/announcement/Announcement";
import DrawerStackScreen from "./navigation/DrawerStackScreen";
import AsyncStorage from "@react-native-community/async-storage";

export default function App() {
  const persistor = persistStore(store);
  const toast = useToast();
  const rrfConfig = {
    userProfile: "users",
    useFirestoreForProfile: true,
  };
  const rrfProps = {
    firebase: firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
  };

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.data.announcement) {
        await AsyncStorage.setItem('notification', 'true');
      }
      myNotification(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
      );
      console.log();
    });
    const unsubcribe1 = messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage.notification.body !== "Timings has been updated") {
        navigate("Announcement");
      } else {
        navigate("home");
      }
    });

    return () => {
      unsubcribe1();
      unsubscribe();
      messaging().onTokenRefresh(token => {
        saveToken(token);
      });
    };
  }, [toast]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <NavigationContainer ref={navigationRef}>
            <ToastProvider>
              <DrawerStackScreen />
            </ToastProvider>
          </NavigationContainer>
        </ReactReduxFirebaseProvider>
      </PersistGate>
    </Provider>
  );
}
