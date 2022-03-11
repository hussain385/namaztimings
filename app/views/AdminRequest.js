import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useFirestore} from 'react-redux-firebase';
import * as Yup from 'yup';
import {getFcmToken} from '../store/token';
import axios from 'axios';

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const ERROR = {
  color: 'darkred',
  marginLeft: 10,
  marginTop: 10,
};

const AdminRequestSchema = Yup.object().shape({
  userEmail: Yup.string().email().required('Email is required'),
  userName: Yup.string().required('Your name is required'),
  userPhone: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(11, 'phone no. is short, please check again')
    .max(16, 'phone no. is long, please check again')
    .required('Your Phone no. is required'),
});

const AdminRequest = ({id, masjidName}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(!modalVisible);
        }}>
        <Text
          style={{
            color: '#1F441E',
            fontWeight: 'bold',
            textDecorationLine: 'underline',
          }}>
          Become an Admin
        </Text>
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Formik
              initialValues={{
                userEmail: '',
                userName: '',
                userPhone: '',
                masjidID: `${id}`,
              }}
              validationSchema={AdminRequestSchema}
              onSubmit={async values => {
                console.log(values);
                setLoading(true);
                const token = await getFcmToken();
                await firestore
                  .collection('adminRequest')
                  .add({...values, token})
                  .then(
                    async () =>
                      await axios
                        .post(
                          'https://namaz-timings-pakistan.herokuapp.com/email',
                          {
                            to: 'juzer.shabbir@gmail.com',
                            body: `Dear Admin,\n${masjidName} has received an admin request from ${values.userName}`,
                            title: 'Admin Notification',
                          },
                        )
                        .then(() => {
                          Alert.alert(
                            'Request send successfully',
                            'Jazak Allah u Khairan for your contribution. Admin will review and contact you in 24 hours.',
                            [
                              {
                                text: 'Ok',
                                onPress: () => {
                                  setModalVisible(!modalVisible);
                                  setLoading(false);
                                },
                              },
                            ],
                          );
                        }),
                  );
              }}>
              {({
                handleChange,
                handleSubmit,
                handleBlur,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.container}>
                  <Text style={styles.modalText}>Admin Request</Text>
                  <Text style={{marginLeft: 10, marginTop: 10}}>User Name</Text>
                  <View
                    style={{
                      borderRadius: 10,
                      marginHorizontal: 10,
                      marginTop: 5,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.34,
                      shadowRadius: 6.27,
                      elevation: 5,
                    }}>
                    <TextInput
                      onChangeText={handleChange('userName')}
                      value={values.userName}
                      onBlur={handleBlur('userName')}
                      style={{
                        paddingHorizontal: 10,
                        backgroundColor: '#EEEEEE',
                        color: 'black',
                      }}
                      placeholder="Enter Your Name..."
                      placeholderTextColor="grey"
                    />
                  </View>
                  {errors.userName && touched.userName && (
                    <Text style={ERROR}>{errors.userName}</Text>
                  )}
                  <Text style={{marginLeft: 10, marginTop: 10}}>
                    User Email
                  </Text>
                  <View
                    style={{
                      borderRadius: 10,
                      marginHorizontal: 10,
                      marginTop: 5,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.34,
                      shadowRadius: 6.27,
                      elevation: 5,
                    }}>
                    <TextInput
                      onChangeText={handleChange('userEmail')}
                      value={values.userEmail}
                      onBlur={handleBlur('userEmail')}
                      style={{
                        paddingHorizontal: 10,
                        backgroundColor: '#EEEEEE',
                        color: 'black',
                      }}
                      placeholder="Enter Your Email..."
                      placeholderTextColor="grey"
                    />
                  </View>
                  {errors.userEmail && touched.userEmail && (
                    <Text style={ERROR}>{errors.userEmail}</Text>
                  )}
                  <Text style={{marginLeft: 10, marginTop: 10}}>
                    User Phone Number
                  </Text>
                  <View
                    style={{
                      borderRadius: 10,
                      marginHorizontal: 10,
                      marginTop: 5,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.34,
                      shadowRadius: 6.27,
                      elevation: 5,
                    }}>
                    <TextInput
                      onChangeText={handleChange('userPhone')}
                      value={values.userPhone}
                      keyboardType="number-pad"
                      onBlur={handleBlur('userPhone')}
                      style={{
                        paddingHorizontal: 10,
                        backgroundColor: '#EEEEEE',
                        color: 'black',
                      }}
                      placeholder="Enter Your Phone Number..."
                      placeholderTextColor="grey"
                    />
                  </View>
                  {errors.userPhone && touched.userPhone && (
                    <Text style={ERROR}>{errors.userPhone}</Text>
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      alignSelf: 'center',
                      marginHorizontal: 20,
                    }}>
                    <Pressable
                      style={[styles.button, styles.buttonOpen]}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}>
                      <Text style={styles.textStyle}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      disabled={loading}
                      style={[
                        styles.button,
                        styles.buttonClose,
                        {
                          backgroundColor: '#1F441E',
                        },
                      ]}
                      onPress={handleSubmit}>
                      {loading ? (
                        <ActivityIndicator color="#CEE6B4" size="small" />
                      ) : (
                        <Text
                          style={[
                            styles.textStyle1,
                            {
                              color: '#CEE6B4',
                            },
                          ]}>
                          Confirm
                        </Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '130%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000071',
  },
  modalView: {
    margin: 22,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '30%',
  },
  buttonOpen: {
    backgroundColor: '#5C5C5C',
    marginRight: 15,
  },
  buttonClose: {
    backgroundColor: '#1F441E',
    marginLeft: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyle1: {
    color: '#CEE6B4',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'center',
  },
});

export default AdminRequest;
