import * as React from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HomeScreen from './components/HomeScreen';
import Search from './components/Search';
import Favourites from './components/Favourites';
import Invite from './components/Invite';
import ContactUS from './components/ContactUs';
import Login from './components/Login';
import Notifications from './components/Notifications';
import Terms from './components/Terms';
import Admin from './components/Admin';
import {createDrawerNavigator} from '@react-navigation/drawer';
import '@react-native-firebase/app';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator initialRouteName="HOME">
      <Drawer.Screen name="Home" component={MyTabs} />
      <Drawer.Screen name="Find Masjid" component={MyTabs} />
      <Drawer.Screen name="Favourites" component={MyTabs} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="Invite Your Friends" component={Invite} />
      <Drawer.Screen name="Contact Us" component={ContactUS} />
      <Drawer.Screen name="Terms & Conditions" component={Terms} />
      <Drawer.Screen name="Admin view" component={Admin} />
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
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
        initialRouteName: 'HOME',
      }}>
      <Tab.Screen
        name="FAVOURITES"
        component={Favourites}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text
              style={{
                color: focused ? '#1F441E' : 'grey',
                marginBottom: 5,
              }}>
              FAVOURITES
            </Text>
          ),
          tabBarIcon: ({focused, color}) => (
            <Icon name="star" color={focused ? '#1F441E' : 'grey'} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="HOME"
        component={HomeScreen}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text
              style={{
                color: focused ? '#1F441E' : 'grey',
                marginBottom: 5,
              }}>
              HOME
            </Text>
          ),
          tabBarIcon: ({focused, color}) => (
            <Icon name="home" color={focused ? '#1F441E' : 'grey'} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="Find Masjid"
        component={Search}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text
              style={{
                color: focused ? '#1F441E' : 'grey',
                marginBottom: 5,
              }}>
              SEARCH
            </Text>
          ),
          tabBarIcon: ({focused, color}) => (
            <Icon
              name="search"
              color={focused ? '#1F441E' : 'grey'}
              size={20}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}
