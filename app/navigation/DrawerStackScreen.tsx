import CustomDrawerContent from "../components/drawer/CustomDrawerContent"
import ContactUS from "../views/contact/ContactUs"
import Login from "../views/login/Login"
import * as React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { NavigatorScreenParams } from "@react-navigation/native"
import HomeStackScreen, { HomeStackParamList } from "./HomeStackScreen"
import messaging from "@react-native-firebase/messaging"
import myNotification, { navigate } from "../components/notification/push"
import { saveToken } from "../hooks/token"
import { useToast } from "react-native-toast-notifications"
import { useAppDispatch } from "../hooks/redux"
import { addOrModifyAnnouncement, AnnouncementStatus } from "../redux/announcementSlicer"

export type DrawerStackParamList = {
  Root: NavigatorScreenParams<HomeStackParamList>
  Login: undefined
  "Contact Us": undefined
}

const Drawer = createDrawerNavigator<DrawerStackParamList>()

function DrawerStackScreen() {
  const toast = useToast()
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.data?.announcement) {
        dispatch(
          addOrModifyAnnouncement({
            masjidId: remoteMessage.data.masjidId,
            status: AnnouncementStatus.UnRead,
            id: remoteMessage.data.id,
          }),
        )
      }
      myNotification(remoteMessage.notification?.title, remoteMessage.notification?.body)
      console.log(remoteMessage.data, "The Data from Message")
    })

    messaging().setBackgroundMessageHandler(async (message) => {
      if (message.data?.announcement) {
        dispatch(
          addOrModifyAnnouncement({
            masjidId: message.data.masjidId,
            status: AnnouncementStatus.UnRead,
            id: message.data.id,
          }),
        )
      }
    })

    const unsubcribe1 = messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage.notification?.body !== "Timings has been updated") {
        navigate("Announcement")
      } else {
        navigate("home")
      }
    })

    return () => {
      unsubcribe1()
      unsubscribe()
      messaging().onTokenRefresh((token) => {
        saveToken(token)
      })
    }
  }, [toast])

  return (
    <Drawer.Navigator
      initialRouteName="Root"
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Root" component={HomeStackScreen} />
      <Drawer.Screen name="Contact Us" component={ContactUS} />
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  )
}

export default DrawerStackScreen
