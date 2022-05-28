import MasjidInfo from "../views/info/MasjidInfo";
import { AddMasjid } from "../views/addMasjid/AddMasjid";
import Announcement from "../views/announcement/Announcement";
import Map from "../views/maps/Map";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import Maps1 from "../views/maps/Maps1";
import ShowMore from "../views/showMore/ShowMore";
import ForgotPassword from "../views/login/ForgotPassword";
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabStackScreen from "./TabStackScreen";

const HomeStack = createStackNavigator();

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={TabStackScreen}
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
  </HomeStack.Navigator>
);

export default HomeStackScreen;
