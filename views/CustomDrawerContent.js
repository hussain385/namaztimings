/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import _ from 'lodash';
import React, {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../store/fireAuth';
import CoText from '../views/Text/Text';

const CustomDrawerContent = ({navigation}) => {
  const user = useContext(AuthContext);

  async function handleSignOut() {
    await auth().signOut();

    navigation.navigate('Home');
  }

  return (
    <DrawerContentScrollView style={{backgroundColor: '#CEE6B4'}}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 30,
          borderBottomColor: '#1F441E',
          borderBottomWidth: 1,
          marginBottom: 30,
        }}>
        <CoText textStyles={[{color: 'grey', fontSize: 30}]} text="LOGO" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Entypo name="home" size={26} color="#1F441E" />
        <View style={{marginLeft: 30}}>
          <CoText textStyles={[{color: '#1F441E'}]} text="Home" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Find Masjid')}
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 25,
        }}>
        <Icon name="mosque" color="#1F441E" size={19} />
        <View style={{marginLeft: 30}}>
          <CoText textStyles={[{color: '#1F441E'}]} text="Find Masjid" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Favourites')}
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 25,
        }}>
        <MaterialCommunityIcons name="star" size={26} color="#1F441E" />
        <View style={{marginLeft: 30}}>
          <CoText textStyles={[{color: '#1F441E'}]} text="Favourites" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications')}
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 25,
          marginLeft: 6,
        }}>
        <Icon
          name="clipboard-list"
          color="#1F441E"
          size={20}
          style={{marginRight: 6}}
        />
        <View style={{marginLeft: 30}}>
          <CoText textStyles={[{color: '#1F441E'}]} text="Notifications" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Invite Your Friends')}
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 25,
          marginLeft: 4,
        }}>
        <MaterialCommunityIcons name="share" size={26} color="#1F441E" />
        <View style={{marginLeft: 30}}>
          <CoText
            textStyles={[{color: '#1F441E'}]}
            text="Invite Your Friends"
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Contact Us')}
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 25,
          marginLeft: 4,
        }}>
        <MaterialCommunityIcons name="phone" size={26} color="#1F441E" />
        <View style={{marginLeft: 30}}>
          <CoText textStyles={[{color: '#1F441E'}]} text="Contact Us" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Terms & Conditions')}
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 25,
          marginLeft: 4,
        }}>
        <MaterialCommunityIcons name="newspaper" size={26} color="#1F441E" />
        <View style={{marginLeft: 30}}>
          <CoText textStyles={[{color: '#1F441E'}]} text="Terms & Conditions" />
        </View>
      </TouchableOpacity>
      {(() => {
        if (!_.isNull(user)) {
          return (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate('Admin view')}
                style={{
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 25,
                  marginLeft: 4,
                }}>
                <MaterialCommunityIcons
                  name="account-circle"
                  size={26}
                  color="#1F441E"
                />
                <View style={{marginLeft: 30}}>
                  <CoText textStyles={[{color: '#1F441E'}]} text="Admin view" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 25,
                  marginLeft: 4,
                }}
                onPress={handleSignOut}>
                <MaterialCommunityIcons
                  name="logout"
                  size={26}
                  color="#1F441E"
                />
                <View style={{marginLeft: 30}}>
                  <CoText textStyles={[{color: '#1F441E'}]} text="Sign Out" />
                </View>
              </TouchableOpacity>
            </>
          );
        } else {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('login')}
              style={{
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 25,
                marginLeft: 4,
              }}>
              <MaterialCommunityIcons name="logout" size={26} color="#1F441E" />
              <View style={{marginLeft: 30}}>
                <CoText textStyles={[{color: '#1F441E'}]} text="Login" />
              </View>
            </TouchableOpacity>
          );
        }
      })()}
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
