import storage from '@react-native-firebase/storage';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFirestore} from 'react-redux-firebase';
import * as Yup from 'yup';
import Edit from './Edit';
import {useSelector} from 'react-redux';

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const ERROR = {
  color: 'darkred',
  marginLeft: 10,
  marginTop: 10,
};

const AddMasjidSchema = Yup.object().shape({
  name: Yup.string().required('Masjid name is required'),
  gLink: Yup.string().url().required('Masjid address link is required'),
  pictureURL: Yup.string().required('Masjid picture is required'),
  userEmail: Yup.string().email().required('Email is required'),
  userName: Yup.string().required('Your name is required'),
  userPhone: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(11, 'phone no. is short, please check again')
    .max(16, 'phone no. is long, please check again')
    .required('Your Phone no. is required'),
  // timing: Yup.object().shape({
  //   isha: Yup.string(),
  //   fajar: Yup.string(),
  //   zohar: Yup.string(),
  //   asar: Yup.string(),
  //   magrib: Yup.string(),
  //   jummuah: Yup.string(),
  // }),
});

export const AddMasjid = ({navigation}) => {
  const firestore = useFirestore();
  const [image, setImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const {auth, profile} = useSelector(state => state.firebase);
  const [timing, setTiming] = useState({
    isha: '00:00 AM',
    fajar: '00:00 AM',
    zohar: '00:00 AM',
    asar: '00:00 AM',
    magrib: '00:00 AM',
    jummuah: '00:00 AM',
  });

  const chooseImage = (event, value, handleChange, error) => {
    console.log(value, error);
    let options = {
      title: 'Select Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      }
      if (response?.assets[0]?.error) {
        alert('An error occurred: ', response.assets[0].error.message);
      } else if (response?.assets[0]?.uri) {
        const {uri} = response.assets[0];
        console.log(uri);
        setImage(response.assets[0]);
        handleChange(uri);
        value.pictureURL = uri;
        setImageLoading(true);
      }
    });
  };

  return (
    <>
      <Header
        containerStyle={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 5,
        }}
        leftComponent={
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SearchStackScreen', {
                screen: 'Find Masjid',
              })
            }>
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
                textAlign: 'center',
              }}>
              Add Masjid
            </Text>
          </View>
        }
        backgroundColor="#1F441E"
      />
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 20}}>Enter Masjid Details</Text>
      </View>
      <Formik
        initialValues={{
          name: '',
          gLink: '',
          pictureURL: '',
          userEmail: auth.email || '',
          userName: profile.name || '',
          userPhone: profile.phone || '',
          // timing: {
          //   isha: '',
          //   fajar: '',
          //   zohar: '',
          //   asar: '',
          //   magrib: '',
          //   jummuah: '',
          // },
        }}
        validationSchema={AddMasjidSchema}
        onSubmit={async values => {
          setLoading(true);
          const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
          const uploadUri =
            Platform.OS === 'ios'
              ? image.uri.replace('file://', '')
              : image.uri;
          const ref = storage().ref('/masjid/' + filename);
          await ref.putFile(uploadUri);
          const url = await ref.getDownloadURL();
          await firestore
            .collection('newMasjid')
            .add({...values, pictureURL: url, timing})
            .then(() =>
              Alert.alert('Request', 'Your request has been send', [
                {
                  text: 'Ok',
                  onPress: () => {
                    navigation.navigate('SearchStackScreen', {
                      screen: 'Find Masjid',
                    });
                    setLoading(false);
                  },
                },
              ]),
            );
          // .then(
          //   snapshot => {
          //     console.log(snapshot);
          // firestore
          //   .collection('newMasjid')
          //   .add({...values, pictureURL: values, timing})
          //   .then(
          //     value1 => {
          //       console.log('the new masjid data has been sent', value1);
          //     },
          //     reason => {
          //       console.error(
          //         'caught error while submitting new masjid data',
          //         reason,
          //       );
          //     },
          //   );
          //   },
          //   reason => {
          //     console.error(
          //       'caught error while submitting new masjid data',
          //       reason,
          //     );
          //   },
          // );
        }}>
        {({
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <View
            style={{
              height: Dimensions.get('window').height - 110,
            }}>
            <ScrollView>
              <Text style={{marginLeft: 10, marginTop: 10}}>Masjid Name</Text>
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
                  onChangeText={handleChange('name')}
                  value={values.name}
                  onBlur={handleBlur('name')}
                  style={{
                    paddingHorizontal: 10,
                    backgroundColor: '#EEEEEE',
                    color: 'black',
                  }}
                  placeholder="Enter Masjid Name..."
                  placeholderTextColor="grey"
                />
              </View>
              {errors.name && touched.name && (
                <Text style={ERROR}>{errors.name}</Text>
              )}
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
              <Text style={{marginLeft: 10, marginTop: 10}}>User Email</Text>
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
              <Text style={{marginLeft: 10, marginTop: 10}}>
                Masjid Address
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
                  onChangeText={handleChange('gLink')}
                  value={values.gLink}
                  onBlur={handleBlur('gLink')}
                  style={{
                    paddingHorizontal: 10,
                    backgroundColor: '#EEEEEE',
                    color: 'black',
                  }}
                  placeholder="Enter Masjid Address Google Link..."
                  placeholderTextColor="grey"
                />
              </View>
              {errors.gLink && touched.gLink && (
                <Text style={ERROR}>{errors.gLink}</Text>
              )}
              <View
                style={{
                  margin: 15,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 10,
                  }}>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                    Namaz Timings
                  </Text>
                </View>
                <Edit
                  fajar={timing.fajar}
                  zohar={timing.zohar}
                  asar={timing.asar}
                  magrib={timing.magrib}
                  isha={timing.isha}
                  isAdd={true}
                  userInfo={false}
                  handleChange={setTiming}
                />
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    paddingLeft: 10,
                  }}>
                  <Text style={{fontSize: 17}}>Fajr</Text>
                </View>
                <View
                  style={{
                    paddingRight: 10,
                  }}>
                  <Text style={{fontSize: 17}}>{timing.fajar}</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    paddingLeft: 10,
                  }}>
                  <Text style={{fontSize: 17}}>Zohr</Text>
                </View>
                <View
                  style={{
                    paddingRight: 10,
                  }}>
                  <Text style={{fontSize: 17}}>{timing.zohar}</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    paddingLeft: 10,
                  }}>
                  <Text style={{fontSize: 17}}>Asr</Text>
                </View>
                <View
                  style={{
                    paddingRight: 10,
                  }}>
                  <Text style={{fontSize: 17}}>{timing.asar}</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    paddingLeft: 10,
                  }}>
                  <Text style={{fontSize: 17}}>Magrib</Text>
                </View>
                <View
                  style={{
                    paddingRight: 10,
                  }}>
                  <Text style={{fontSize: 17}}>{timing.magrib}</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    paddingLeft: 10,
                  }}>
                  <Text style={{fontSize: 17}}>Isha</Text>
                </View>
                <View
                  style={{
                    paddingRight: 10,
                  }}>
                  <Text style={{fontSize: 17}}>{timing.isha}</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    paddingLeft: 10,
                  }}>
                  <Text style={{fontSize: 17}}>Jumu&apos;ah</Text>
                </View>
                <View
                  style={{
                    paddingRight: 10,
                  }}>
                  <Text style={{fontSize: 17}}>{timing.jummuah || '--'}</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    paddingLeft: 10,
                  }}>
                  <Text style={{fontSize: 17}}>Eid Ul Fitr</Text>
                </View>
                <View
                  style={{
                    paddingRight: 10,
                  }}>
                  <Text style={{fontSize: 17}}>{timing.eidulfitr || '--'}</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    paddingLeft: 10,
                  }}>
                  <Text style={{fontSize: 17}}>Eid Ul Adha</Text>
                </View>
                <View
                  style={{
                    paddingRight: 10,
                  }}>
                  <Text style={{fontSize: 17}}>{timing.eiduladha || '--'}</Text>
                </View>
              </View>
              {errors.timing && touched.timing && (
                <Text style={ERROR}>{errors.timing}</Text>
              )}
              <View
                style={{
                  marginTop: 15,
                  marginHorizontal: 15,
                  borderBottomColor: '#C4C4C4',
                  borderBottomWidth: 1,
                }}
              />
              <View
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                  height: 200,
                  backgroundColor: '#DDDDDD',
                  width: '90%',
                  marginTop: 10,
                  borderRadius: 5,
                }}>
                {image.uri ? (
                  <>
                    <Image
                      style={{width: 150, height: 130, marginVertical: '3%'}}
                      source={{uri: `${image.uri}`}}
                    />
                    <TouchableOpacity
                      onPress={e =>
                        chooseImage(
                          e,
                          values,
                          handleChange('pictureURL'),
                          errors,
                        )
                      }
                      style={{
                        alignItems: 'center',
                        backgroundColor: '#1F441E',
                        padding: 10,
                        borderRadius: 5,
                        width: '50%',
                        marginHorizontal: 10,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#CEE6B4',
                        }}>
                        Choose a different file
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <MaterialIcons
                      name="photo-camera-back"
                      size={100}
                      color="white"
                      style={{marginVertical: '10%'}}
                    />
                    <TouchableOpacity
                      onPress={e =>
                        chooseImage(
                          e,
                          values,
                          handleChange('pictureURL'),
                          errors,
                        )
                      }
                      style={{
                        alignItems: 'center',
                        backgroundColor: '#1F441E',
                        padding: 10,
                        borderRadius: 5,
                        width: '35%',
                        marginHorizontal: 10,
                        marginTop: '-7%',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#CEE6B4',
                        }}>
                        Choose File
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                {errors.pictureURL && (
                  <Text style={ERROR}>{errors.pictureURL}</Text>
                )}
              </View>
              <View style={{alignItems: 'center', marginVertical: 15}}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#CEE6B4',
                    padding: 10,
                    borderRadius: 5,
                    width: '95%',
                    marginHorizontal: 10,
                  }}>
                  {!loading ? (
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#1F441E',
                      }}>
                      Submit
                    </Text>
                  ) : (
                    <ActivityIndicator color="#1F441E" size="small" />
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Formik>
    </>
  );
};
