import React from 'react';
import {View} from 'react-native';
import HeaderComp from '../views/HeaderComp';

const Announcement = ({navigation}) => {
  return (
    <View>
      <HeaderComp navigation={navigation} heading="Announcements" />
    </View>
  );
};

export default Announcement;
