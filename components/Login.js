/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Header} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth';
import auth from '@react-native-firebase/auth';

const Login = ({navigation}) => {
  const [email, setEmail] = useState();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth());
  function onChangeEmail(text) {
    setEmail(text);
  }
  const [password, setPassword] = useState();
  function onChangePassword(text) {
    setPassword(text);
  }
  function submitLogin() {
    signInWithEmailAndPassword(email, password);
    console.log('Logged in as :', user);
  }
  return (
    <SafeAreaProvider>
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
              Login
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
      <View style={{flex: 1}}>
        <View>
          <TextInput
            onChangeText={onChangeEmail}
            value={email}
            placeholder="Enter Email Address..."
            style={{
              backgroundColor: '#eeee',
              width: '80%',
              borderRadius: 10,
              alignContent: 'center',
              height: 40,
            }}
          />
        </View>
        <View>
          <TextInput
            onChangeText={onChangePassword}
            value={password}
            placeholder="Enter Password..."
            style={{
              backgroundColor: '#eeee',
              width: '80%',
              borderRadius: 10,
              alignContent: 'center',
              height: 40,
            }}
          />
        </View>
        {error && (
          <View>
            <Text>Error: {JSON.stringify(error.message)}</Text>
          </View>
        )}
        {!loading && (
          <TouchableOpacity
            onPress={submitLogin}
            style={{
              backgroundColor: 'green',
              width: '40%',
              textAlign: 'center',
            }}>
            <Text>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaProvider>
  );
};

export default Login;
