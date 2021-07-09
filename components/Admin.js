import * as React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Header} from 'react-native-elements';

const Admin = ({navigation}) => {
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
              Admin
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

export default Admin;
