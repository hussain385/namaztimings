/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Header} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {btnStyles, conStyles, textIn, textStyles} from '../theme/styles/Base';
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CoText from '../views/Text/Text';
import {isEmpty, isLoaded, useFirebase} from 'react-redux-firebase';
import {useSelector} from 'react-redux';
import * as Yup from 'yup';
import {Formik} from 'formik';

// const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const LogInSchema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = ({navigation}) => {
  const forgotLoading = false;
  const firebaseApp = useFirebase();
  const auth = useSelector(state => state.firebase.auth);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded(auth) && !isEmpty(auth)) {
      console.log('the current user:', auth);
      navigation.navigate('Admin view');
    }
  }, [auth, navigation]);

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
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={LogInSchema}
          onSubmit={async values => {
            try {
              await firebaseApp.login({
                email: values.email,
                password: values.password,
              });
            } catch (e) {
              setError(e.message);
            }
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            values,
            errors,
          }) => (
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
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                      />
                    </View>
                  </View>
                  {errors.email && touched.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}
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
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                      />
                      <Icon
                        style={styles.icon}
                        name="visibility-off"
                        size={20}
                        color="#000000"
                      />
                    </View>
                  </View>
                  {errors.password && touched.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
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
                  }}
                />
                <View
                  style={{
                    justifyContent: 'space-evenly',
                    paddingHorizontal: 20,
                  }}>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={btnStyles.basic}>
                    <CoText
                      textStyles={[textStyles.simple, {color: 'white'}]}
                      text="SIGN IN "
                    />
                  </TouchableOpacity>
                </View>
                {error && <Text style={styles.error}>{error}</Text>}
              </View>
            </TouchableWithoutFeedback>
          )}
        </Formik>
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
  error: {
    color: 'red',
  },
});

export default Login;
