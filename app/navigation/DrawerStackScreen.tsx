import CustomDrawerContent from "../components/drawer/CustomDrawerContent"
import Notifications from "../components/masjidInfo/Notifications"
import ContactUS from "../views/contact/ContactUs"
import Login from "../views/login/Login"
import AdminView from "../components/admin/AdminView"
import Donation from "../components/donation/Donation"
import * as React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { NavigatorScreenParams } from "@react-navigation/native"
import Admin from "../components/admin/Admin"
import HomeStackScreen, { HomeStackParamList } from "./HomeStackScreen"
import { useBackButtonHandler } from "./navigation-utilities"
import { Masjid } from "../types/firestore"

export type DrawerStackParamList = {
  Root: NavigatorScreenParams<HomeStackParamList>
  Login: undefined
  "Contact Us": undefined
  Notifications: undefined
  "Admin view": undefined
  Admin: {
    Masjid: Masjid
    isSingle?: boolean
  }
  Donation: {
    masjid: Masjid
    edit: boolean
    adminView?: boolean
  }
}

const Drawer = createDrawerNavigator<DrawerStackParamList>()

function DrawerStackScreen() {
  useBackButtonHandler(canExit)
  return (
    <Drawer.Navigator
      initialRouteName="Root"
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Root" component={HomeStackScreen} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="Contact Us" component={ContactUS} />
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="Admin view" component={Admin} />
      <Drawer.Screen name="Admin" component={AdminView} />
      <Drawer.Screen
        name="Donation"
        component={Donation}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  )
}

export default DrawerStackScreen

const exitRoutes = ["Home"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
