/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityBase,
  Linking,
  View,
} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import Entypo from 'react-native-vector-icons/Entypo';
import {Header} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {GetRadMasjidData1} from '../store/firebase';
// import Geocoder from 'react-native-geocoding';
import Favbtn from '../views/Favbtn';
import {headerStyles, textStyles} from '../theme/styles/Base';
import CoText from '../views/Text/Text';

function HomeScreen({navigation}) {
  const [masjidData, loading, location, error, getLocation, GetData] =
    new GetRadMasjidData1();
  const [refreshing, setRefreshing] = useState(false);
  // Geocoder.init('AIzaSyCrsNBX-pWunuPeL-ziP99aXhetdZL2VKs');

  useEffect(() => {
    onRefresh();
    const willFocusSubscription = navigation.addListener('focus', () => {
      onRefresh();
    });

    console.log(location.coords.longitude, '<========== location ');
    // Geocoder.from(location.coords.longitude, location.coords.latitude)
    //   .then(json => {
    //     var addressComponent = json.results[0].address_components[0];
    //     console.log(addressComponent);
    //   })
    //   .catch(error1 => console.warn(error1));
    return willFocusSubscription;
  }, [location.coords.latitude, location.coords.longitude]);
  // #E1E1E1
  function onRefresh() {
    setRefreshing(true);
    getLocation();
    GetData();
    setRefreshing(false);
  }

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
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Map', {
                  latitude: location.coords.latitude || 0.0,
                  longitude: location.coords.longitude || 0.0,
                })
              }>
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
            </TouchableOpacity>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            style={{
              paddingRight: 10,
            }}>
            <View>
              <View style={headerStyles.cartTxt}>
                <CoText
                  textStyles={[
                    textStyles.simple,
                    {fontSize: 10, color: '#1F441E'},
                  ]}
                  text="0"
                />
              </View>
              <MaterialIcons name="bell" size={28} color="white" />
            </View>
          </TouchableOpacity>
        }
        backgroundColor="#1F441E"
      />
      <>
        {error.message.trim().isEmpty && (
          <View>
            <Alert>Error: {JSON.stringify(error)}</Alert>
          </View>
        )}
        {loading ? (
          <ActivityIndicator color="#1F441E" size="large" />
        ) : masjidData.length !== 0 ? (
          <SafeAreaView style={styles.container}>
            <ScrollView
              style={styles.scrollView}
              refreshControl={
                <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
              }>
              <View>
                <View>
                  <Text
                    style={{textAlign: 'center', fontSize: 17, padding: 15}}>
                    MASJID NEAR YOUR LOCATION
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
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
                      }}>
                      {masjidData[0].name}
                    </Text>
                  </View>
                  <Favbtn favId={masjidData[0].key} />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="map-marker-alt"
                      color="#5C5C5C"
                      size={20}
                      style={{
                        paddingRight: 10,
                        paddingLeft: 13,
                        marginTop: 5,
                      }}
                    />
                    <Text style={{maxWidth: 200, marginTop: 5}}>
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
                      onPress={() => {
                        Linking.openURL(
                          `https://maps.google.com/?q=${masjidData[0].g.latitude},${masjidData[0].g.longitude}`,
                        );
                      }}
                      style={{
                        color: '#900000',
                        fontSize: 17,
                        marginRight: 12,
                        fontWeight: 'bold',
                        fontStyle: 'underlined',
                        textDecorationLine: 'underline',
                      }}>
                      {masjidData[0].distance} KM AWAY
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: 5,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="user-alt"
                      color="#5C5C5C"
                      size={20}
                      style={{paddingRight: 10, paddingLeft: 10}}
                    />
                    <Text style={{maxWidth: 280, marginTop: 2}}>
                      {masjidData[0].user.name}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: 10,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="phone-alt"
                      color="#5C5C5C"
                      size={20}
                      style={{paddingRight: 10, paddingLeft: 10}}
                    />
                    <Text
                      style={{maxWidth: 280, marginTop: 0}}
                      onPress={() => {
                        Linking.openURL('tel:+92 323 0000000');
                      }}>
                      {masjidData[0].user.phone}
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
                        marginTop: -30,
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
                      <Text style={{color: '#008000'}}> 14th May 2021</Text>
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
                    paddingHorizontal: 5,
                  }}>
                  <TouchableOpacity
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
                        distance: masjidData[0].distance,
                        favId: masjidData[0].key,
                        latitude: masjidData[0].g.latitude,
                        longitude: masjidData[0].g.longitude,
                        user: masjidData[0].user,
                      })
                    }
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
                      More Info
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
                    onPress={() => navigation.navigate('Show More')}>
                    <Text style={{color: '#CEE6B4'}}>Show More Masjid</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        ) : (
          <SafeAreaView>
            <ScrollView
              refreshControl={
                <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
              }>
              <Text>Data not found try refreshing</Text>
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
