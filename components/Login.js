/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Header} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth';
import auth from '@react-native-firebase/auth';
import {conStyles, textStyles, textIn, btnStyles} from '../theme/styles/Base';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableOpacityBase,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import CoText from '../views/Text/Text';

// const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const Login = ({navigation}) => {
  const [email, setEmail] = useState();
  const forgotLoading = false;
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
    if (!_.isNull(user)) {
      navigation.navigate('Admin view');
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={conStyles.safeAreaMy}>
      <SafeAreaProvider>
        <Header
          containerStyle={{
            shadowOpacity: 50,
            elevation: 50,
          }}
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome
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
                  fontSize: 25,
                  marginBottom: 5,
                }}>
                Login
              </Text>
            </View>
          }
          backgroundColor="#1F441E"
        />
        {/* <View style={{flex: 1}}>
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
      </View> */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              justifyContent: 'space-between',
              paddingHorizontal: 30,
              paddingBottom: 30,
            }}>
            <StatusBar backgroundColor="#2E2E2E" translucent />
            <View
              style={{
                alignItems: 'center',
                flex: 0.5,
                justifyContent: 'center',
              }}>
              <CoText text="LOGO" textStyles={[{fontSize: 25}]} />
            </View>

            <View
              style={{
                justifyContent: 'flex-start',
              }}>
              <View>
                <CoText
                  textStyles={[textStyles.simple, {fontSize: 20}]}
                  text="SIGN IN"
                />
              </View>
              <View style={textIn.Flabel}>
                <View>
                  <CoText
                    textStyles={[textStyles.simple, {color: '#5C5C5C'}]}
                    text="Email address"
                  />
                </View>
                <View>
                  <TextInput
                    style={textIn.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={onChangeEmail}
                    value={email}
                  />
                </View>
              </View>
              <View>
                <View style={textIn.label}>
                  <CoText
                    textStyles={[textStyles.simple, {color: '#5C5C5C'}]}
                    text="Password"
                  />
                </View>
                <View>
                  <TextInput
                    style={textIn.input}
                    autoCapitalize="none"
                    onChangeText={onChangePassword}
                    value={password}
                  />
                  <Icon
                    style={styles.icon}
                    name="visibility-off"
                    size={20}
                    color="#000000"
                  />
                </View>
              </View>
              {forgotLoading ? (
                <View
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    marginTop: 10,
                  }}>
                  <ActivityIndicator size="small" />
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    marginTop: 10,
                  }}>
                  <CoText
                    textStyles={[textStyles.simple, {color: 'red'}]}
                    text="Forgot Password?"
                  />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {error && (
                <>
                  <CoText
                    textStyles={[textStyles.simple, {color: 'red'}]}
                    text={JSON.stringify(error.message)}
                  />
                </>
              )}
            </View>
            <View
              style={{
                justifyContent: 'space-evenly',
                paddingHorizontal: 20,
              }}>
              <TouchableOpacity onPress={submitLogin} style={btnStyles.basic}>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <CoText
                    textStyles={[textStyles.simple, {color: 'white'}]}
                    text="SIGN IN "
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaProvider>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: WIDTH / 1.5,
    alignSelf: 'center',
  },
  icon: {
    position: 'absolute',
    padding: 10,
    right: 0,
    bottom: 0,
  },
});

export default Login;
