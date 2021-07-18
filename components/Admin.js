/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Text, TouchableOpacity, View, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Header} from 'react-native-elements';
import {useCollectionOnce} from 'react-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../store/fireAuth';
import {ActivityIndicator} from 'react-native-paper';

const Admin = ({navigation}) => {
  const user = React.useContext(AuthContext);
  const [snapshot, loading, error] = useCollectionOnce(
    firestore().collection('Masjid').where('adminId', '==', user.uid),
  );
  console.log(snapshot, error);
  return (
    <SafeAreaView>
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
      {error && (
        <View>
          <Text>{error}</Text>
        </View>
      )}
      {loading && <ActivityIndicator color="#1F441E" size="large" />}
      {!loading && (
        <View>
          <Text>{snapshot[0].name}</Text>
          <Text>{snapshot[0].address}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Admin;
