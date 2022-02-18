import * as React from 'react';
import {View} from 'react-native';
import HeaderComp from '../views/HeaderComp';

const Terms = ({navigation}) => {
  return (
    <View>
      <HeaderComp navigation={navigation} heading="Terms & Condition" />
    </View>
  );
};

export default Terms;
