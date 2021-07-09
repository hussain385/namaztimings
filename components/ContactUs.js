import * as React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationContainer} from '@react-navigation/native';
import {Header} from 'react-native-elements';

const ContactUs = ({navigation}) => {
  return (
    <View>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-left"
              color="#ffff"
              size={26}
              style={{paddingLeft: 10}}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <View style={{textAlign: 'center'}}>
            <Text
              style={{
                color: '#ffff',
                fontSize: 22,
                marginBottom: 5,
                marginTop: 5,
                textAlign: 'center',
              }}>
              ContactUs
            </Text>
          </View>
        }
        rightComponent={
          <Icon
            name="shopping-cart"
            color="#ffff"
            size={26}
            style={{paddingRight: 10}}
          />
        }
        backgroundColor="#1F441E"
      />
    </View>
  );
};

export default ContactUs;
