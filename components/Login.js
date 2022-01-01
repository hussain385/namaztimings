import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
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
import {Header} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {isEmpty, isLoaded, useFirebase} from 'react-redux-firebase';
import * as Yup from 'yup';
import {btnStyles, conStyles, textIn, textStyles} from '../theme/styles/Base';
import CoText from '../views/Text/Text';
import {selectFirebase} from '../store/firebase';

// const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const LogInSchema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = ({navigation}) => {
  const forgotLoading = false;
  const firebaseApp = useFirebase();
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(true);
  const {auth} = useSelector(selectFirebase);
  const [error, setError] = useState(null);
  const [iconName, setIconName] = useState('eye-off-outline');

  const handleIcon = () => {
    if (iconName === 'eye-off-outline') {
      setIconName('eye-outline');
      setVisibility(false);
    } else {
      setIconName('eye-off-outline');
      setVisibility(true);
    }
  };

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
            setLoading(true);
            try {
              await firebaseApp.login({
                email: values.email,
                password: values.password,
              });
              setLoading(false);
            } catch (e) {
              setError(e.message);
              setLoading(false);
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
                  <CoText
                    text="Namaz Timings"
                    textStyles={[{fontSize: 30}]}
                  />
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
                        placeholderTextColor="grey"
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
                    <TextInput
                      style={textIn.input}
                      secureTextEntry={visibility}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      placeholderTextColor="grey"
                    />
                    <MaterialCommunityIcons
                      onPress={handleIcon}
                      style={styles.icon}
                      name={iconName}
                      size={23}
                      color="#000000"
                    />
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
                      onPress={() => navigation.navigate('Forgot')}
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
                    {loading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <CoText
                        textStyles={[textStyles.simple, {color: 'white'}]}
                        text="SIGN IN "
                      />
                    )}
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
