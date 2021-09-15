import React from 'react';
import {Formik} from 'formik';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import * as Yup from 'yup';
import {btnStyles, textIn, textStyles} from '../theme/styles/Base';
import CoText from './Text/Text';
import {useFirebase} from 'react-redux-firebase';

const ForgotPassword = () => {
  const firebase = useFirebase();

  return (
    <Formik
      validationSchema={Yup.object().shape({
        email: Yup.string().email().required('Email is required'),
      })}
      initialValues={{email: ''}}
      onSubmit={values => firebase.resetPassword(values.email)}>
      {({values, handleChange, handleSubmit, handleBlur, errors, touched}) => (
        <View>
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
            {errors.email && touched.email && (
              <Text style={{color: 'red'}}>{errors.email}</Text>
            )}
          </View>
          <TouchableOpacity onPress={handleSubmit} style={btnStyles.basic}>
            <CoText
              textStyles={[textStyles.simple, {color: 'white'}]}
              text="Send"
            />
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default ForgotPassword;
