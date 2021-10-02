import * as React from 'react';
import {View} from 'react-native';
import HeaderComp from '../views/HeaderComp';

const Invite = ({navigation}) => {
  return (
    <View>
      <HeaderComp navigation={navigation} heading="Share App" />
    </View>
  );
};

export default Invite;
