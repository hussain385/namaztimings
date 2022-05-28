import CustomDrawerContent from "../components/drawer/CustomDrawerContent";
import Notifications from "../components/masjidInfo/Notifications";
import ContactUS from "../views/contact/ContactUs";
import Login from "../views/login/Login";
import Admin from "../components/admin/Admin";
import AdminView from "../components/admin/AdminView";
import AdminNotification from "../components/admin/AdminNotification";
import Donation from "../components/donation/Donation";
import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeStackScreen from "./HomeStackScreen";
import SearchStackScreen from "./SearchStackScreen";
import Favourites from "../views/favourite/Favourites";

const Drawer = createDrawerNavigator();

function DrawerStackScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeStackScreen} />
      <Drawer.Screen name="Find Masjid" component={SearchStackScreen} />
      <Drawer.Screen name="Favourites" component={Favourites} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="Contact Us" component={ContactUS} />
      <Drawer.Screen name="login" component={Login} />
      <Drawer.Screen name="Admin view" component={Admin} />
      <Drawer.Screen name="Admin" component={AdminView} />
      <Drawer.Screen
        name="adminNotification"
        component={AdminNotification}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Notification"
        component={Notifications}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Donation"
        component={Donation}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerStackScreen;
