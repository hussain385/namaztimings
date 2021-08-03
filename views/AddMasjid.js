/* eslint-disable react-native/no-inline-styles */
import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Edit from './Edit';

export const AddMasjid = ({navigation}) => {
  const [timing, setTiming] = useState({
    isha: '00:00 AM',
    fajar: '00:00 AM',
    zohar: '00:00 AM',
    asar: '00:00 AM',
    magrib: '00:00 AM',
  });
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
          UserEmail: '',
          UserName: '',
          MasjidName: '',
          UserPhone: '',
          MasjidAddress: '',
        }}
        onSubmit={values => console.log(values)}>
        {({handleChange, handleSubmit, values}) => (
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
                  onChangeText={handleChange('email')}
                  value={values.email}
                  style={{paddingHorizontal: 10, backgroundColor: '#EEEEEE'}}
                  placeholder="Enter Masjid Name..."
                />
              </View>
              <Text style={{marginLeft: 10, marginTop: 10}}>
                Contact Person
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
                  onChangeText={handleChange('email')}
                  value={values.email}
                  style={{paddingHorizontal: 10, backgroundColor: '#EEEEEE'}}
                  placeholder="Enter Your Name..."
                />
              </View>
              <Text style={{marginLeft: 10, marginTop: 10}}>Contact Email</Text>
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
                  onChangeText={handleChange('email')}
                  value={values.email}
                  style={{paddingHorizontal: 10, backgroundColor: '#EEEEEE'}}
                  placeholder="Enter Your Email..."
                />
              </View>
              <Text style={{marginLeft: 10, marginTop: 10}}>
                Contact Person Number
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
                  onChangeText={handleChange('email')}
                  value={values.email}
                  style={{paddingHorizontal: 10, backgroundColor: '#EEEEEE'}}
                  placeholder="Enter Your Phone Number..."
                />
              </View>
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
                  onChangeText={handleChange('email')}
                  value={values.email}
                  style={{paddingHorizontal: 10, backgroundColor: '#EEEEEE'}}
                  placeholder="Enter Masjid Address..."
                />
              </View>
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
                  <Text style={{fontSize: 17}}>Jumu'ah</Text>
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
              <View
                style={{
                  marginTop: 15,
                  marginHorizontal: 15,
                  borderBottomColor: '#C4C4C4',
                  borderBottomWidth: 1,
                }}
              />
              <View style={{alignItems: 'center', marginVertical: 15}}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#CEE6B4',
                    padding: 10,
                    borderRadius: 5,
                    width: '95%',
                    marginHorizontal: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#1F441E',
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Formik>
    </>
  );
};
