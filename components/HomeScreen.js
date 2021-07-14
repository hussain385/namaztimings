/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
// import {NavigationContainer} from '@react-navigation/native';
// import {Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';
import {GetRadMasjidData} from '../store/firebase';
import Geocoder from 'react-native-geocoding';

function HomeScreen({navigation}) {
  const [masjidData, loading, error] = GetRadMasjidData();
  const [location, setLocation] = useState();
  function getCurrentLocation() {
    return new Promise((resolve, reject) =>
      Geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      }),
    );
  }
  Geocoder.init('AIzaSyCrsNBX-pWunuPeL-ziP99aXhetdZL2VKs');
  useEffect(() => {
    getCurrentLocation()
      .then(loc => {
        setLocation(loc);
        console.log(loc.coords.longitude, '<========== location ');
        Geocoder.from(loc.coords.longitude, loc.coords.latitude)
          .then(json => {
            var addressComponent = json.results[0].address_components[0];
            console.log(addressComponent);
          })
          .catch(error => console.warn(error));
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
    <>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon
              name="bars"
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
              Prayer Time
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Icon
                name="map-marker-alt"
                color="#ffff"
                size={16}
                style={{paddingRight: 10}}
              />
              <Text
                style={{
                  color: '#ffff',
                  fontSize: 17,
                  textDecorationLine: 'underline',
                  marginTop: -4,
                }}>
                Zainee Manzil, Saddar...
              </Text>
            </View>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Map', {
                latitude: location.coords.latitude || 0.0,
                longitude: location.coords.longitude || 0.0,
              })
            }>
            <Icon
              name="bell"
              color="#ffff"
              size={26}
              style={{paddingRight: 10, marginTop: 3}}
            />
          </TouchableOpacity>
        }
        backgroundColor="#1F441E"
      />
      <>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading ? (
          <ActivityIndicator color="#1F441E" size="large" />
        ) : (
          <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
              <View>
                <View>
                  <Text
                    style={{textAlign: 'center', fontSize: 17, padding: 15}}>
                    MASJID NEAR YOUR LOCATION
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flexGrow: 1, flexDirection: 'row'}}>
                    <Icon
                      name="mosque"
                      color="#5C5C5C"
                      size={20}
                      style={{paddingRight: 10, paddingLeft: 10}}
                    />
                    <Text
                      style={{fontSize: 24, color: '#5C5C5C', marginTop: -5}}>
                      {masjidData[0].name}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#E1E1E1',
                      borderRadius: 100,
                      marginRight: 10,
                      textAlign: 'center',
                      padding: 15,
                      marginTop: -20,
                    }}>
                    <Icon name="star" color="#5C5C5C" size={20} />
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flexGrow: 1, flexDirection: 'row'}}>
                    <Icon
                      name="map-marker-alt"
                      color="#5C5C5C"
                      size={20}
                      style={{paddingRight: 10, paddingLeft: 13, marginTop: 5}}
                    />
                    <Text style={{maxWidth: 280, marginTop: 5}}>
                      {masjidData[0].address}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Icon
                      name="directions"
                      color="#900000"
                      size={20}
                      style={{paddingRight: 10, paddingLeft: 10}}
                    />
                    <Text
                      style={{
                        color: '#900000',
                        fontSize: 18,
                        marginRight: 12,
                      }}>
                      {masjidData[0].distance}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <View style={{flexGrow: 1, flexDirection: 'row'}}>
                    <Icon
                      name="user-alt"
                      color="#5C5C5C"
                      size={20}
                      style={{paddingRight: 10, paddingLeft: 10}}
                    />
                    <Text style={{maxWidth: 280, marginTop: 2}}>
                      Moulana Tariq
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View style={{flexGrow: 1, flexDirection: 'row'}}>
                    <Icon
                      name="phone-alt"
                      color="#5C5C5C"
                      size={20}
                      style={{paddingRight: 10, paddingLeft: 10}}
                    />
                    <Text style={{maxWidth: 280, marginTop: 0}}>
                      +92 323 0000000
                    </Text>
                  </View>
                  <View>
                    <Image
                      source={{
                        uri: `${masjidData[0].pictureURL}`,
                      }}
                      style={{
                        width: 141,
                        height: 76,
                        marginTop: -20,
                        marginRight: 10,
                        borderRadius: 8,
                      }}
                    />
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      flexGrow: 1,
                      flexDirection: 'row',
                      backgroundColor: '#E1E1E1',
                      padding: 10,
                    }}>
                    <Text style={{fontSize: 17}}>
                      Last Updated:
                      <Text style={{color: '#008000'}}>14th May 2021</Text>
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      flexGrow: 1,
                      flexDirection: 'row',
                      paddingLeft: 10,
                    }}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                      Namaz Timings
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      flexGrow: 1,
                      paddingLeft: 10,
                    }}>
                    <Text style={{fontSize: 17}}>Fajr</Text>
                  </View>
                  <View
                    style={{
                      paddingRight: 10,
                    }}>
                    <Text style={{fontSize: 17}}>
                      {masjidData[0].timing.fajar}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      flexGrow: 1,
                      paddingLeft: 10,
                    }}>
                    <Text style={{fontSize: 17}}>Zohr</Text>
                  </View>
                  <View
                    style={{
                      paddingRight: 10,
                    }}>
                    <Text style={{fontSize: 17}}>
                      {masjidData[0].timing.zohar}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      flexGrow: 1,
                      paddingLeft: 10,
                    }}>
                    <Text style={{fontSize: 17}}>Asr</Text>
                  </View>
                  <View
                    style={{
                      paddingRight: 10,
                    }}>
                    <Text style={{fontSize: 17}}>
                      {masjidData[0].timing.asar}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      flexGrow: 1,
                      paddingLeft: 10,
                    }}>
                    <Text style={{fontSize: 17}}>Magrib</Text>
                  </View>
                  <View
                    style={{
                      paddingRight: 10,
                    }}>
                    <Text style={{fontSize: 17}}>
                      {masjidData[0].timing.magrib}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      flexGrow: 1,
                      paddingLeft: 10,
                    }}>
                    <Text style={{fontSize: 17}}>Isha</Text>
                  </View>
                  <View
                    style={{
                      paddingRight: 10,
                    }}>
                    <Text style={{fontSize: 17}}>
                      {masjidData[0].timing.isha}
                    </Text>
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
                  }}>
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      backgroundColor: '#364547',
                      padding: 10,
                      borderRadius: 5,
                      width: 160,
                      marginHorizontal: 10,
                    }}
                    onPress={() =>
                      navigation.navigate('More Info', {
                        name: masjidData[0].name,
                        url: masjidData[0].pictureURL,
                        address: masjidData[0].address,
                        isha: masjidData[0].timing.isha,
                        fajar: masjidData[0].timing.fajar,
                        zohar: masjidData[0].timing.zohar,
                        asar: masjidData[0].timing.asar,
                        magrib: masjidData[0].timing.magrib,
                      })
                    }>
                    <Text style={{color: '#ffff'}}>More Info</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      backgroundColor: '#CEE6B4',
                      padding: 10,
                      borderRadius: 5,
                      width: 160,
                      marginHorizontal: 10,
                    }}
                    onPress={() => navigation.navigate('Notifications')}>
                    <Text style={{color: '#1F441E'}}>News & Announcment</Text>
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
                      width: 300,
                      marginHorizontal: 10,
                    }}
                    onPress={() => navigation.navigate('Show More')}>
                    <Text style={{color: '#CEE6B4'}}>Show More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 60,
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

export default HomeScreen;
