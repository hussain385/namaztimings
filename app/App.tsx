import firebase from "@react-native-firebase/app"
import "@react-native-firebase/auth"
import { NavigationContainer } from "@react-navigation/native"
import * as React from "react"
import { navigationRef } from "./components/notification/push"
import { Provider } from "react-redux"
import { ReactReduxFirebaseProvider } from "react-redux-firebase"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"
import { store } from "./redux/store"
import { ToastProvider } from "react-native-toast-notifications"
import DrawerStackScreen from "./navigation/DrawerStackScreen"

export default function App() {
  const persistor = persistStore(store)

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ReactReduxFirebaseProvider
          firebase={firebase}
          dispatch={store.dispatch}
          config={{
            updateProfileOnLogin: true,
            userProfile: "users",
            useFirestoreForProfile: true,
            enableRedirectHandling: false,
            logErrors: true,
          }}
        >
          <NavigationContainer ref={navigationRef}>
            <ToastProvider>
              <DrawerStackScreen />
            </ToastProvider>
          </NavigationContainer>
        </ReactReduxFirebaseProvider>
      </PersistGate>
    </Provider>
  )
}
