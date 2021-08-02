/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Edit from './Edit';
import Favbtn from './Favbtn';

const MasjidInfo = ({route, navigation}) => {
  const {name} = route.params;
  const {url} = route.params;
  const {address} = route.params;
  const {timing} = route.params;
  const {distance} = route.params;
  const {favId} = route.params;
  const {latitude} = route.params;
  const {longitude} = route.params;
  const {user} = route.params;

  console.log(user);

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
              Masjid Info
            </Text>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Map1', {
                latitude: latitude,
                longitude: longitude,
                name: name,
              })
            }>
            <Icon
              name="map-marker-alt"
              color="#ffff"
              size={26}
              style={{paddingRight: 10, marginTop: 3}}
            />
          </TouchableOpacity>
        }
        backgroundColor="#1F441E"
      />
      <SafeAreaView style={{height: Dimensions.get('window').height - 85}}>
        <ScrollView>
          <View>
            <View>
              <Text style={{textAlign: 'center', fontSize: 17, padding: 15}}>
                MASJID NEAR YOUR LOCATION
              </Text>
            </View>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="mosque"
                  color="#5C5C5C"
                  size={20}
                  style={{paddingRight: 10, paddingLeft: 10}}
                />
                <Text
                  style={{
                    fontSize: 17,
                    color: '#5C5C5C',
                    fontWeight: 'bold',
                    maxWidth: 200,
                  }}>
                  {name}
                </Text>
              </View>
              <Favbtn favId={favId} isBig={false} />
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="map-marker-alt"
                  color="#5C5C5C"
                  size={20}
                  style={{paddingRight: 18, paddingLeft: 14}}
                />
                <Text style={{maxWidth: 200}}>{address}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="directions"
                  color="#900000"
                  size={20}
                  style={{paddingRight: 7}}
                />
                <Text
                  onPress={() => {
                    Linking.openURL(
                      `https://maps.google.com/?q=${latitude},${longitude}`,
                    );
                  }}
                  style={{
                    color: '#900000',
                    fontSize: 16,
                    marginRight: 12,
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                  }}>
                  {distance} Km Away
                </Text>
              </View>
            </View>
            {user.name !== 'No Admin' ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="user-alt"
                      color="#5C5C5C"
                      size={20}
                      style={{paddingRight: 18, paddingLeft: 10}}
                    />
                    <Text style={{maxWidth: 280}}>{user.name}</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="phone-alt"
                      color="#5C5C5C"
                      size={20}
                      style={{paddingRight: 18, paddingLeft: 10}}
                    />
                    <Text
                      style={{maxWidth: 280}}
                      onPress={() => {
                        Linking.openURL(`tel:${user.phone}`);
                      }}>
                      {user.phone}
                    </Text>
                  </View>
                  <View>
                    <Image
                      source={{
                        uri: `${url}`,
                      }}
                      style={{
                        width: 141,
                        height: 76,
                        marginTop: -30,
                        marginRight: 10,
                        borderRadius: 10,
                      }}
                    />
                  </View>
                </View>
              </>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingBottom: 10,
                    marginTop: 10,
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                    }}>
                    <Icon
                      name="user-alt"
                      color="#1F441E"
                      size={20}
                      style={{paddingRight: 18, paddingLeft: 12}}
                    />
                    <TouchableOpacity>
                      <Text
                        style={{
                          color: '#1F441E',
                          fontWeight: 'bold',
                          textDecorationLine: 'underline',
                        }}>
                        Become An Admin
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={{
                      uri: `${url}`,
                    }}
                    style={{
                      width: 141,
                      height: 76,
                      marginRight: 10,
                      borderRadius: 10,
                    }}
                  />
                </View>
              </>
            )}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#E1E1E1',
                  flexGrow: 1,
                  padding: 10,
                }}>
                <Text style={{fontSize: 17}}>
                  Last Updated:
                  <Text style={{color: '#008000'}}>14th May 2021</Text>
                </Text>
              </View>
            </View>
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
                uid={favId}
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
          </View>
          <View
            style={{
              margin: 15,
              borderBottomColor: '#C4C4C4',
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingHorizontal: 5,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
              style={{
                alignItems: 'center',
                backgroundColor: '#CEE6B4',
                padding: 10,
                borderRadius: 5,
                width: '70%',
                marginHorizontal: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#1F441E',
                }}>
                News & Announcement
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                backgroundColor: '#1F441E',
                padding: 10,
                borderRadius: 5,
                width: '70%',
                marginHorizontal: 10,
              }}
              // onPress={() => navigation.navigate('Show More')}
            >
              <Text style={{color: '#CEE6B4'}}>Donation</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
//'#364547'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 6,
  },
  mncontainer: {
    flex: 1,
    marginTop: 30,
  },
  navigationContainer: {
    backgroundColor: '#1F441E',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
});

export default MasjidInfo;
