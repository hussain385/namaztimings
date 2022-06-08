import MasjidInfo from "../views/info/MasjidInfo"
import { AddMasjid } from "../views/addMasjid/AddMasjid"
import Announcement from "../views/announcement/Announcement"
import Map from "../views/maps/Map"
import { TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"
import Maps1 from "../views/maps/Maps1"
import ShowMore from "../views/showMore/ShowMore"
import ForgotPassword from "../views/login/ForgotPassword"
import * as React from "react"
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from "@react-navigation/stack"
import TabStackScreen, { TabStackParamList } from "./TabStackScreen"
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { DrawerNavigationProp, DrawerScreenProps } from "@react-navigation/drawer"
import { DrawerStackParamList } from "./DrawerStackScreen"
import { Masjid } from "../types/firestore"
import Admin from "../components/admin/Admin"
import AdminView from "../components/admin/AdminView"
import Notifications from "../components/masjidInfo/Notifications"
import Donation from "../components/donation/Donation"
import AdminNotification from "../components/admin/AdminNotification"

export type HomeStackParamList = {
  Tabs: NavigatorScreenParams<TabStackParamList>
  "More Info": { masjid: Masjid }
  "Add Masjid": undefined
  Announcement: undefined
  Map: {
    latitude: number
    longitude: number
  }
  Map1: {
    masjid: Masjid
  }
  "Show More": undefined
  Forgot: undefined
  "Admin view": undefined
  Admin: {
    Masjid: Masjid
  }
  Notifications: {
    masjid: Masjid
  }
  Donation: {
    masjid: Masjid
    edit: boolean
    adminView?: boolean
  }
  "Admin Notification": {
    masjid: Masjid
  }
}

const HomeStack = createStackNavigator<HomeStackParamList>()

export type HomePropsType<Name extends keyof HomeStackParamList> = CompositeScreenProps<
  StackScreenProps<HomeStackParamList, Name>,
  DrawerScreenProps<DrawerStackParamList, "Root">
>

export type HomePropsNavigation<Name extends keyof HomeStackParamList> = CompositeNavigationProp<
  StackNavigationProp<HomeStackParamList, Name>,
  DrawerNavigationProp<DrawerStackParamList, "Root">
>

const HomeStackScreen: React.FC<DrawerScreenProps<DrawerStackParamList, "Root">> = ({
  navigation,
}) => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Tabs" component={TabStackScreen} options={{ headerShown: false }} />
    <HomeStack.Screen
      name="More Info"
      component={MasjidInfo}
      options={{
        title: "Prayer Time",
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Add Masjid"
      component={AddMasjid}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Announcement"
      component={Announcement}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Map"
      component={Map}
      options={{
        headerTransparent: true,
        title: "",
        headerLeft: () => (
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              width: "100%",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginHorizontal: 15, marginTop: 7 }}
            >
              <Icon name="arrow-left" color="#1F441E" size={25} />
            </TouchableOpacity>
          </View>
        ),
      }}
    />

    <HomeStack.Screen
      name="Map1"
      component={Maps1}
      options={{
        headerTransparent: true,
        title: "",
        headerLeft: () => (
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              width: "100%",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginHorizontal: 15, marginTop: 7 }}
            >
              <Icon name="arrow-left" color="#1F441E" size={25} />
            </TouchableOpacity>
          </View>
        ),
      }}
    />

    <HomeStack.Screen
      name="Show More"
      component={ShowMore}
      options={{
        title: "Show more",
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Forgot"
      component={ForgotPassword}
      options={{
        title: "Forgot",
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      options={{
        headerShown: false,
      }}
      name="Admin view"
      component={Admin}
    />
    <HomeStack.Screen
      options={{
        headerShown: false,
      }}
      name="Admin"
      component={AdminView}
    />
    <HomeStack.Screen
      options={{
        headerShown: false,
      }}
      name="Notifications"
      component={Notifications}
    />
    <HomeStack.Screen
      name="Donation"
      component={Donation}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Admin Notification"
      component={AdminNotification}
      options={{
        headerShown: false,
      }}
    />
  </HomeStack.Navigator>
)

export default HomeStackScreen