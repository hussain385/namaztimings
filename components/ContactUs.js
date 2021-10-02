import * as React from 'react';
import {View} from 'react-native';
import HeaderComp from '../views/HeaderComp';

const ContactUs = ({navigation}) => {
  return (
    <View>
      <HeaderComp navigation={navigation} heading="Contact Us" />
    </View>
  );
};

export default ContactUs;
