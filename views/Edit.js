import {Formik} from 'formik';
import _ from 'lodash';
import moment from 'moment';
import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Button, HelperText, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import * as Yup from 'yup';
import firestore from '@react-native-firebase/firestore';

const Edit = ({
  timing,
  uid,
  adminId = '',
  isRequest = true,
  value = 'Edit',
  isAdd = false,
  handleChange: returnChange = null,
  userInfo = true,
}) => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [namazTime, setNamazTime] = useState('');
  // const [disabled, setDisabled] = useState(userInfo);
  // const [time, setTime] = useState({
  //   userName: '',
  //   userContact: '',
  //   isha: isha,
  //   fajar: fajar,
  //   zohar: zohar,
  //   asar: asar,
  //   magrib: magrib,
  // });
  // const firestore = useFirestore();

  const showTimePicker = namazName => {
    setTimePickerVisibility(true);
    setNamazTime(namazName);
  };

  const {profile} = useSelector(state => state.firebase);

  // async function submitRequest() {
  //   const prevTime = {
  //     userName: '',
  //     userContact: '',
  //     isha: isha,
  //     fajar: fajar,
  //     zohar: zohar,
  //     asar: asar,
  //     magrib: magrib,
  //   };
  //   if (_.isEqual(time, prevTime) && isRequest) {
  //     console.log(isRequest);
  //     Alert.alert('Cannot Process', 'Please fill the form correctly');
  //   } else {
  //     if (isAdd) {
  //       setModalVisible(!modalVisible);
  //       return handleChange(time);
  //     }
  //     if (isRequest) {
  //       try {
  //         await firestore
  //           .collection('requests')
  //           .add({
  //             timing: time,
  //             adminId,
  //             isRead: false,
  //             createdAt: firestore.Timestamp.now(),
  //           })
  //           .then(a => {
  //             firestore
  //               .collection('Masjid')
  //               .doc(uid)
  //               .update({
  //                 requestList: firestore.FieldValue.arrayUnion(a.id),
  //               })
  //               .then(value1 => {
  //                 Alert.alert(
  //                   'Request Send!',
  //                   'Request has been forwarded to the admin',
  //                   [
  //                     {
  //                       text: 'Ok',
  //                       onPress: () => setModalVisible(!modalVisible),
  //                     },
  //                   ],
  //                   {cancelable: false},
  //                 );
  //               });
  //           });
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     } else {
  //       try {
  //         await firestore
  //           .collection('Masjid')
  //           .doc(uid)
  //           .update({
  //             timing: {
  //               ...time,
  //             },
  //           })
  //           .then(a => {
  //             console.log('data sent');
  //             setModalVisible(!modalVisible);
  //             // GetRadMasjidData1().GetData();
  //           });
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     }
  //   }
  // }

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (newTime, setFieldValue) => {
    const timeString = moment(newTime).format('hh:mm A');
    console.log(timeString);
    setFieldValue('timing.' + namazTime, timeString);
    console.log('A Time has been picked: ', timeString);
    hideTimePicker();
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        style={{flexDirection: 'row', paddingRight: 10}}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}>
        <Text style={{fontSize: 16, marginTop: 3, fontWeight: '200'}}>
          {value}
        </Text>
        <Icon name="square-edit-outline" size={24} style={{marginTop: 1}} />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Namaz Timings</Text>
            <Formik
              initialValues={{
                userName: profile.name || '',
                userPhone: profile.phone || '',
                timing: {
                  isha: timing?.isha || '',
                  fajar: timing?.fajar || '',
                  zohar: timing?.zohar || '',
                  asar: timing?.asar || '',
                  magrib: timing?.magrib || '',
                  jummah: timing?.jummah || '',
                  eidUlAddah: timing?.eidUlAddah || '',
                  eidUlFitr: timing?.eidUlFitr || '',
                },
              }}
              onSubmit={async (values, {setSubmitting}) => {
                setSubmitting(true);
                // if (returnChange) {
                //   setSubmitting(false);
                //   return returnChange(values.timing);
                // }
                console.log(values);

                if (_.isEqual(values.timing, timing) && isRequest) {
                  console.log(isRequest);
                  Alert.alert(
                    'Cannot Process',
                    'Please fill the form correctly',
                  );
                } else {
                  if (isAdd) {
                    setModalVisible(!modalVisible);
                    setSubmitting(false);
                    return returnChange(values.timing);
                  }
                  if (isRequest) {
                    firestore()
                      .collection('requests')
                      .add({
                        ...values,
                        isRead: false,
                        timeStamp: firestore.Timestamp.now(),
                      })
                      .then(
                        a => {
                          firestore()
                            .collection('Masjid')
                            .doc(uid)
                            .update({
                              requestList: firestore.FieldValue.arrayUnion(
                                a.id,
                              ),
                            })
                            .then(
                              () => {
                                setSubmitting(false);
                                Alert.alert(
                                  'Request Send!',
                                  'Request has been forwarded to the admin',
                                  [
                                    {
                                      text: 'Ok',
                                      onPress: () =>
                                        setModalVisible(!modalVisible),
                                    },
                                  ],
                                  {cancelable: false},
                                );
                              },
                              reason => {
                                firestore()
                                  .collection('requests')
                                  .doc(a.id)
                                  .delete()
                                  .then(() => {
                                    setSubmitting(false);
                                    console.warn(reason);
                                    Alert.alert(
                                      'Error',
                                      reason.message,
                                      [
                                        {
                                          text: 'Ok',
                                          onPress: () =>
                                            setModalVisible(!modalVisible),
                                        },
                                      ],
                                      {cancelable: false},
                                    );
                                  });
                              },
                            );
                        },
                        reason => {
                          Alert.alert(
                            'Error',
                            reason.message,
                            [
                              {
                                text: 'Ok',
                                onPress: () => setModalVisible(!modalVisible),
                              },
                            ],
                            {cancelable: false},
                          );
                        },
                      );
                  } else {
                    try {
                      await firestore()
                        .collection('Masjid')
                        .doc(uid)
                        .update({
                          timing: {
                            ...values.timing,
                          },
                        })
                        .then(() => {
                          setSubmitting(false);
                          console.log('data sent');
                          setModalVisible(!modalVisible);
                        });
                    } catch (e) {
                      console.error(e);
                    }
                  }
                }
              }}
              validationSchema={Yup.object().shape({
                userName: Yup.string().required('your name is required'),
                userPhone: Yup.string()
                  .matches(
                    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
                    'Phone number is not valid',
                  )
                  .min(11, 'phone no. is short, please check again')
                  .max(16, 'phone no. is long, please check again'),
                timing: Yup.object()
                  .shape({
                    isha: Yup.string().test(
                      'isDateTime',
                      'not a valid Time',
                      value1 => moment(value1, 'hh:mm A').isValid(),
                    ),
                    fajar: Yup.string().test(
                      'isDateTime',
                      'not a valid Time',
                      value1 => moment(value1, 'hh:mm A').isValid(),
                    ),
                    zohar: Yup.string().test(
                      'isDateTime',
                      'not a valid Time',
                      value1 => moment(value1, 'hh:mm A').isValid(),
                    ),
                    asar: Yup.string().test(
                      'isDateTime',
                      'not a valid Time',
                      value1 => moment(value1, 'hh:mm A').isValid(),
                    ),
                    magrib: Yup.string().test(
                      'isDateTime',
                      'not a valid Time',
                      value1 => moment(value1, 'hh:mm A').isValid(),
                    ),
                    // jummuah: Yup.string().test('isDateTime','not a valid Time', value => moment(value, 'hh:mm A').isValid()),
                  })
                  .required(),
              })}>
              {({
                handleChange,
                handleSubmit,
                handleBlur,
                values,
                errors,
                touched,
                isSubmitting,
                setFieldValue,
              }) => (
                <>
                  {userInfo && (
                    <>
                      <View
                        style={{width: Dimensions.get('screen').width * 0.75}}>
                        <TextInput
                          label={'User Name'}
                          mode={'outlined'}
                          onChangeText={handleChange('userName')}
                          onBlur={handleBlur('userName')}
                          value={values.userName}
                          style={{
                            paddingHorizontal: 10,
                            backgroundColor: '#EEEEEE',
                            color: 'black',
                          }}
                          placeholder="Enter Your Name..."
                          placeholderTextColor="grey"
                          error={touched.userName && Boolean(errors.userName)}
                        />
                        <HelperText
                          type="error"
                          visible={
                            touched.userName && Boolean(errors.userName)
                          }>
                          {touched.userName && errors.userName}
                        </HelperText>
                      </View>
                      <View
                        style={{
                          width: Dimensions.get('screen').width * 0.75,
                        }}>
                        <TextInput
                          label={'User Phone'}
                          mode={'outlined'}
                          onChangeText={handleChange('userPhone')}
                          onBlur={handleBlur('userPhone')}
                          value={values.userPhone}
                          style={{
                            paddingHorizontal: 10,
                            backgroundColor: '#EEEEEE',
                            color: 'black',
                          }}
                          placeholder="Enter Your Phone Number..."
                          placeholderTextColor="grey"
                          error={touched.userPhone && Boolean(errors.userPhone)}
                        />
                        <HelperText
                          type="error"
                          visible={
                            touched.userPhone && Boolean(errors.userPhone)
                          }>
                          {touched.userPhone && errors.userPhone}
                        </HelperText>
                      </View>
                    </>
                  )}
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>Fajr :</Text>
                    </View>
                    <View style={styles.editTime}>
                      <Pressable onPress={() => showTimePicker('fajar')}>
                        <Text style={{fontSize: 17}}>
                          {values.timing.fajar}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>Zohr :</Text>
                    </View>
                    <View style={styles.editTime}>
                      <Pressable onPress={() => showTimePicker('zohar')}>
                        <Text style={{fontSize: 17}}>
                          {values.timing.zohar}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>Asar :</Text>
                    </View>
                    <View style={styles.editTime}>
                      <Pressable onPress={() => showTimePicker('asar')}>
                        <Text style={{fontSize: 17}}>{values.timing.asar}</Text>
                      </Pressable>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>Magrib :</Text>
                    </View>
                    <View style={styles.editTime}>
                      <Pressable onPress={() => showTimePicker('magrib')}>
                        <Text style={{fontSize: 17}}>
                          {values.timing.magrib}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>Isha :</Text>
                    </View>
                    <View style={styles.editTime}>
                      <Pressable onPress={() => showTimePicker('isha')}>
                        <Text style={{fontSize: 17}}>{values.timing.isha}</Text>
                      </Pressable>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>jummah :</Text>
                    </View>
                    <View style={styles.editTime}>
                      <Pressable
                        onPress={() => showTimePicker('jummah')}
                        style={{minWidth: 70}}>
                        <Text style={{fontSize: 17}}>
                          {values.timing.jummah}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>eidUlAddah :</Text>
                    </View>
                    <View style={styles.editTime}>
                      <Pressable
                        onPress={() => showTimePicker('eidUlAddah')}
                        style={{minWidth: 70}}>
                        <Text style={{fontSize: 17}}>
                          {values.timing.eidUlAddah}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>eidUlFitr :</Text>
                    </View>
                    <View style={styles.editTime}>
                      <Pressable
                        onPress={() => showTimePicker('eidUlFitr')}
                        style={{minWidth: 70}}>
                        <Text style={{fontSize: 17}}>
                          {values.timing.eidUlFitr}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  <View
                    style={{
                      margin: 15,
                      borderBottomColor: '#C4C4C4',
                      borderBottomWidth: 1,
                    }}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <Pressable
                      style={[styles.button, styles.buttonOpen]}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}>
                      <Text style={styles.textStyle}>Cancel</Text>
                    </Pressable>
                    <Button
                      loading={isSubmitting}
                      onPress={handleSubmit}
                      mode={'contained'}
                      disabled={isSubmitting}
                      uppercase={false}
                      style={[styles.buttonClose, {borderRadius: 10}]}>
                      {isRequest ? 'Request' : 'Confirm'}
                    </Button>
                  </View>
                  <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={e => handleConfirm(e, setFieldValue)}
                    onCancel={hideTimePicker}
                  />
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
//00000071
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000071',
  },
  editTime: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#dddd',
  },
  modalView: {
    margin: 20,
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

export default Edit;
