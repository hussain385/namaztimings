import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Header} from 'react-native-elements';
import Icon1 from 'react-native-vector-icons/FontAwesome5';

const HeaderComp = props => {
  return (
    <Header
      containerStyle={{
        shadowOpacity: 30,
        elevation: 10,
      }}
      leftComponent={
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon1
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
              textAlign: 'center',
            }}>
            {props.heading}
          </Text>
        </View>
      }
      backgroundColor="#1F441E"
    />
  );
};

export default HeaderComp;
