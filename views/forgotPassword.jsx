import React from 'react';
import {Formik} from 'formik';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import * as Yup from 'yup';
import {btnStyles, textIn, textStyles} from '../theme/styles/Base';
import CoText from './Text/Text';
import {useFirebase} from 'react-redux-firebase';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Header} from 'react-native-elements';

const ForgotPassword = ({navigation}) => {
  const firebase = useFirebase();

  return (
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
              Forgot
            </Text>
          </View>
        }
        backgroundColor="#1F441E"
      />
      <Formik
        validationSchema={Yup.object().shape({
          email: Yup.string().email().required('Email is required'),
        })}
        initialValues={{email: ''}}
        onSubmit={values => {
          firebase.resetPassword(values.email).then(() => {
            navigation.goBack();
          });
        }}>
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          errors,
          touched,
        }) => (
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              justifyContent: 'center',
              paddingHorizontal: 30,
              paddingBottom: 30,
            }}>
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
              <Text style={{color: 'red'}}>{errors.email}</Text>
            )}
            <View
              style={{
                // justifyContent: 'space-evenly',
                paddingHorizontal: 20,
                paddingTop: 20,
              }}>
              <TouchableOpacity onPress={handleSubmit} style={btnStyles.basic}>
                <CoText
                  textStyles={[textStyles.simple, {color: 'white'}]}
                  text="Send"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaProvider>
  );
};

export default ForgotPassword;
