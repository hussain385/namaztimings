import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import myNotification, {navigate, navigationRef} from './push';
import {Text, TouchableOpacity, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Provider} from 'react-redux';
import {ReactReduxFirebaseProvider} from 'react-redux-firebase';
import {createFirestoreInstance} from 'redux-firestore';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import Admin from './components/Admin';
import ContactUS from './components/ContactUs';
import Favourites from './components/Favourites';
import HomeScreen from './components/HomeScreen';
import Login from './components/Login';
import Notifications from './components/Notifications';
import Search from './components/Search';
import Terms from './components/Terms';
import {store} from './redux/store';
// import {AuthContext, AuthContextProvider} from './store/fireAuth';
import {AddMasjid} from './views/AddMasjid';
import AdminNotification from './views/AdminNotification';
import AdminView from './views/AdminView';
import CustomDrawerContent from './views/CustomDrawerContent';
import ForgotPassword from './views/forgotPassword';
import Map from './views/Map';
import Maps1 from './views/Maps1';
import MasjidInfo from './views/MasjidInfo';
import ShowMore from './views/ShowMore';
import {ToastProvider, useToast} from 'react-native-toast-notifications';
import messaging from '@react-native-firebase/messaging';
import {saveToken} from './store/token';
import Donation from './components/Donation';
import Announcement from './components/Announcement';

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

const FavouriteStackScreen = () => (
  <FavouriteStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="Favourite">
    <FavouriteStack.Screen
      name="Favourite"
      component={Favourites}
      options={{
        title: 'Prayer Time',
      }}
    />
    {/* <FavouriteStack.Screen
      name="More Info"
      component={MasjidInfo}
      options={{
        title: 'Prayer Time',
      }}
    /> */}
  </FavouriteStack.Navigator>
);
const SearchStackScreen = () => (
  <SearchStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="Find Masjid">
    <SearchStack.Screen
      name="Find Masjid"
      component={Search}
      options={{
        title: 'Prayer Time',
      }}
    />
    {/* <SearchStack.Screen
      name="More Info"
      component={MasjidInfo}
      options={{
        title: 'Prayer Time',
      }}
    /> */}
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
      name="More Info"
      component={MasjidInfo}
      options={{
        title: 'Prayer Time',
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
      name="adminNotification"
      component={AdminNotification}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Notification"
      component={Notifications}
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
              <Icon name="arrow-left" color="#1F441E" size={25} />
            </TouchableOpacity>
            {/* <GooglePlacesAutocomplete
              styles={{
                textInput: {
                  width: Dimensions.get('window').width - 60,
                  color: '#5d5d5d',
                  fontSize: 16,
                  zIndex: 1,
                },
              }}
              placeholder="Search"
              placeholderTextColor="grey"
              onPress={(data, details = null) => {
                console.log(data, details);
              }}
              onFail={error => console.error(error)}
              query={{
                key: 'AIzaSyCrsNBX-pWunuPeL-ziP99aXhetdZL2VKs',
                language: 'en',
                types: '(cities)',
              }}
            /> */}
          </View>
        ),
      }}
    />

    <HomeStack.Screen
      name="Map1"
      component={Maps1}
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
              <Icon name="arrow-left" color="#1F441E" size={25} />
            </TouchableOpacity>
            {/* <GooglePlacesAutocomplete
              styles={{
                textInput: {
                  width: Dimensions.get('window').width - 60,
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
            /> */}
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
    <HomeStack.Screen
      name="Forgot"
      component={ForgotPassword}
      options={{
        title: 'Forgot',
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Donation"
      component={Donation}
      options={{
        title: 'Forgot',
        headerShown: false,
      }}
    />
  </HomeStack.Navigator>
);

function MyDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContentOptions={{
        activeTintColor: '#CEE6B4',
        itemStyle: {backgroundColor: '#CEE6B4'},
        labelStyle: {color: '#1F441E'},
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: '#CEE6B4',
      }}
      screenOptions={({route}) => ({
        drawerIcon: () => {
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
      <Drawer.Screen name="Contact Us" component={ContactUS} />
      <Drawer.Screen name="Terms & Conditions" component={Terms} />
      <Drawer.Screen name="login" component={Login} />
      <Drawer.Screen name="Admin view" component={Admin} />
      <Drawer.Screen name="Admin" component={AdminView} />
      {/* <Drawer.Screen name="More Info" component={MasjidInfo} /> */}
    </Drawer.Navigator>
  );
}

function MyTabs() {
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
        component={FavouriteStackScreen}
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

export default function App() {
  const persistor = persistStore(store);
  const toast = useToast();
  const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
  };
  const rrfProps = {
    firebase: firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance, // <- needed if using firestore
  };

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      myNotification(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
      );
      console.log();
    });
    const unsubcribe1 = messaging().onNotificationOpenedApp(remoteMessage => {
      navigate('Announcement');
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
              <RootStackScreen />
            </ToastProvider>
          </NavigationContainer>
        </ReactReduxFirebaseProvider>
      </PersistGate>
    </Provider>
  );
}
