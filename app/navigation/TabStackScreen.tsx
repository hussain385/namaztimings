import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Entypo from "react-native-vector-icons/Entypo"
import Icon from "react-native-vector-icons/FontAwesome5"
import { Text } from "react-native"
import HomeScreen from "../views/home/HomeScreen"
import * as React from "react"
import Favourites from "../views/favourite/Favourites"
import Search from "../views/search/Search"
import { CompositeScreenProps } from "@react-navigation/native"
import { HomePropsType } from "./HomeStackScreen"

export type TabStackParamList = {
  Home: undefined
  Favourite: undefined
  Search: undefined
}

export type TabPropsType<Name extends keyof TabStackParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabStackParamList, Name>,
  HomePropsType<"Tabs">
>

const Tab = createBottomTabNavigator<TabStackParamList>()

function TabStackScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          if (route.name === "Favourite") {
            return <Entypo name="star" color={focused ? "#1F441E" : "#5C5C5C"} size={24} />
          }
          if (route.name === "Home") {
            return <Icon name="home" color={focused ? "#1F441E" : "#5C5C5C"} size={20} />
          }
          if (route.name === "Search") {
            return <Icon name="search" color={focused ? "#1F441E" : "#5C5C5C"} size={20} />
          }
        },
        headerShown: false,
      })}

      // tabBarOptions={{
      //   style: {
      //     height: "8%",
      //     backgroundColor: "#ffff",
      //     position: "absolute",
      //     bottom: 0,
      //     elevation: 0,
      //     borderTopColor: "#000",
      //   },
      //   activeTintColor: "#000000",
      // }}
    >
      <Tab.Screen
        name="Favourite"
        component={Favourites}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#1F441E" : "#5C5C5C",
                marginBottom: 5,
              }}
            >
              FAVORITES
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#1F441E" : "#5C5C5C",
                marginBottom: 5,
              }}
            >
              HOME
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#1F441E" : "#5C5C5C",
                marginBottom: 5,
              }}
            >
              SEARCH
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default TabStackScreen
