/* eslint-disable prettier/prettier */
import * as React from 'react';
import {Text, TouchableOpacity, Dimensions, View} from 'react-native';
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
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import '@react-native-firebase/app';
import MasjidInfo from './views/MasjidInfo';
import Seacrh from './components/Search';
import ShowMore from './views/ShowMore';
import Map from './views/Map';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {AuthContext, AuthContextProvider} from './store/fireAuth';

const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const FavouriteStack = createStackNavigator();
const RootStack = createStackNavigator();

const RootStackScreen = () => (
  <RootStack.Navigator headerMode="none" animationEnabled={false}>
    <RootStack.Screen
      name="App"
      component={MyDrawer}
      options={{
        animationEnabled: false,
      }}
    />
  </RootStack.Navigator>
);

const FavouriteStackScreen = ({navigation}) => (
  <FavouriteStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="Favourite">
    <FavouriteStack.Screen
      name="Home"
      component={MyTabs}
      options={{title: 'Prayer Time'}}
    />
    <FavouriteStack.Screen
      name="Favourite"
      component={Favourites}
      options={{
        title: 'Prayer Time',
      }}
    />
    <FavouriteStack.Screen
      name="More Info"
      component={MasjidInfo}
      options={{
        title: 'Prayer Time',
      }}
    />
  </FavouriteStack.Navigator>
);
const SearchStackScreen = ({navigation}) => (
  <SearchStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="Find Masjid">
    <SearchStack.Screen
      name="Home"
      component={MyTabs}
      options={{title: 'Prayer Time'}}
    />
    <SearchStack.Screen
      name="Find Masjid"
      component={Seacrh}
      options={{
        title: 'Prayer Time',
      }}
    />
    <SearchStack.Screen
      name="More Info"
      component={MasjidInfo}
      options={{
        title: 'Prayer Time',
      }}
    />
  </SearchStack.Navigator>
);

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={MyTabs}
      options={{title: 'Prayer Time', headerShown: false}}
    />
    <HomeStack.Screen
      name="Prayer Time"
      component={HomeScreen}
      options={{
        title: 'Prayer Time',
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="More Info"
      component={MasjidInfo}
      options={{
        title: 'Prayer Time',
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Map"
      component={Map}
      options={{
        headerTransparent: true,
        title: '',
        headerLeft: () => (
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              width: '100%',
              marginTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{marginHorizontal: 15, marginTop: 7}}>
              <Icon name="arrow-left" color="#ffff" size={25} />
            </TouchableOpacity>
            <GooglePlacesAutocomplete
              styles={{
                textInput: {
                  width: Dimensions.get('window').width - 90,
                  color: '#5d5d5d',
                  fontSize: 16,
                  zIndex: 1,
                },
              }}
              placeholder="Search"
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
              }}
              onFail={error => console.error(error)}
              query={{
                key: 'AIzaSyCrsNBX-pWunuPeL-ziP99aXhetdZL2VKs',
                language: 'en',
                types: '(cities)',
              }}
            />
          </View>
        ),
      }}
    />
    <HomeStack.Screen
      name="Show More"
      component={ShowMore}
      options={{
        title: 'Show more',
        headerShown: false,
      }}
    />
  </HomeStack.Navigator>
);

function MyDrawer() {
  const user = React.useContext(AuthContext);
  console.log(user,'<============= user');
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: '#CEE6B4',
        itemStyle: {backgroundColor: '#CEE6B4'},
        labelStyle: {color: '#1F441E'},
      }}
      drawerStyle={{
        backgroundColor: '#CEE6B4',
      }}
      screenOptions={({route}) => ({
        drawerIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            return (
              <Icon
                name="home"
                color="#1F441E"
                size={16}
                style={{marginTop: 3, paddingRight: 10}}
              />
            );
          }
          if (route.name === 'Find Masjid') {
            return (
              <Icon
                name="mosque"
                color="#1F441E"
                size={16}
                style={{marginTop: 3, paddingRight: 10}}
              />
            );
          }
          if (route.name === 'Favourites') {
            return (
              <Icon
                name="star"
                color="#1F441E"
                size={16}
                style={{marginTop: 3, paddingRight: 10}}
              />
            );
          }
          if (route.name === 'Notifications') {
            return (
              <Icon
                name="clipboard-list"
                color="#1F441E"
                size={16}
                style={{marginTop: 3, paddingRight: 10}}
              />
            );
          }
          if (route.name === 'Invite Your Friends') {
            return (
              <Icon
                name="share"
                color="#1F441E"
                size={16}
                style={{marginTop: 3, paddingRight: 10}}
              />
            );
          }
          if (route.name === 'Contact Us') {
            return (
              <Icon
                name="info-circle"
                color="#1F441E"
                size={16}
                style={{marginTop: 3, paddingRight: 10}}
              />
            );
          }
          if (route.name === 'Terms & Conditions') {
            return (
              <Icon
                name="newspaper"
                color="#1F441E"
                size={16}
                style={{marginTop: 3, paddingRight: 10}}
              />
            );
          }
          if (route.name === 'Admin view') {
            return (
              <Icon
                name="street-view"
                color="#1F441E"
                size={16}
                style={{marginTop: 3, paddingRight: 10}}
              />
            );
          }
          if (route.name === 'Login') {
            return (
              <Icon
                name="user-circle"
                color="#1F441E"
                size={16}
                style={{marginTop: 3, paddingRight: 10}}
              />
            );
          }
        },
      })}>
      <Drawer.Screen name="Home" component={HomeStackScreen} />
      <Drawer.Screen name="Find Masjid" component={SearchStackScreen} />
      <Drawer.Screen name="Favourites" component={FavouriteStackScreen} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="Invite Your Friends" component={Invite} />
      <Drawer.Screen name="Contact Us" component={ContactUS} />
      <Drawer.Screen name="Terms & Conditions" component={Terms} />
      <Drawer.Screen name="Admin view" component={Admin} />
      {user ? (
        <Drawer.Screen name="Login" component={Login} />
      ) : (
        <Drawer.Screen name="Login" component={Login} />
      )}
    </Drawer.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        initialRouteName: 'Home',
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
        name="Favourites"
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
        name="Home"
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
        component={Seacrh}
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
    <AuthContextProvider>
      <NavigationContainer>
        <RootStackScreen />
      </NavigationContainer>
    </AuthContextProvider>
  );
}
