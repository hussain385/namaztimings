import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Entypo from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Text } from "react-native";
import HomeScreen from "../views/home/HomeScreen";
import * as React from "react";
import Favourites from "../views/favourite/Favourites";
import SearchStackScreen from "./SearchStackScreen";

const Tab = createBottomTabNavigator();

function TabStackScreen() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          if (route.name === 'FavouriteStackScreen') {
            return (
              <Entypo
                name="star"
                color={focused ? '#1F441E' : '#5C5C5C'}
                size={24}
              />
            );
          }
          if (route.name === 'home') {
            return (
              <Icon
                name="home"
                color={focused ? '#1F441E' : '#5C5C5C'}
                size={20}
              />
            );
          }
          if (route.name === 'SearchStackScreen') {
            return (
              <Icon
                name="search"
                color={focused ? '#1F441E' : '#5C5C5C'}
                size={20}
              />
            );
          }

          // You can return any component that you like here!
        },
      })}
      tabBarOptions={{
        style: {
          height: '8%',
          backgroundColor: '#ffff',
          position: 'absolute',
          bottom: 0,
          elevation: 0,
          borderTopColor: '#000',
        },
        activeTintColor: '#000000',
      }}>
      <Tab.Screen
        name="FavouriteStackScreen"
        component={Favourites}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#1F441E' : '#5C5C5C',
                marginBottom: 5,
              }}>
              FAVORITES
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#1F441E' : '#5C5C5C',
                marginBottom: 5,
              }}>
              HOME
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="SearchStackScreen"
        component={SearchStackScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#1F441E' : '#5C5C5C',
                marginBottom: 5,
              }}>
              SEARCH
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabStackScreen;
