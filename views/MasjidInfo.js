import * as React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {NavigationContainer} from '@react-navigation/native';
import {Header} from 'react-native-elements';

const MasjidInfo = ({route, navigation}) => {
  const {name} = route.params;
  const {url} = route.params;
  const {address} = route.params;
  const {isha} = route.params;
  const {fajar} = route.params;
  const {zohar} = route.params;
  const {asar} = route.params;
  const {magrib} = route.params;
  const {distance} = route.params;

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
          <Icon
            name="map-marker-alt"
            color="#ffff"
            size={26}
            style={{paddingRight: 10}}
          />
        }
        backgroundColor="#1F441E"
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View>
            <View>
              <Text style={{textAlign: 'center', fontSize: 17, padding: 15}}>
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
                <Text style={{fontSize: 24, color: '#5C5C5C', marginTop: -5}}>
                  {name}
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
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flexGrow: 1, flexDirection: 'row'}}>
                <Icon
                  name="map-marker-alt"
                  color="#5C5C5C"
                  size={20}
                  style={{paddingRight: 10, paddingLeft: 13}}
                />
                <Text style={{maxWidth: 280}}>{address}</Text>
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
                  ${distance}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flexGrow: 1, flexDirection: 'row'}}>
                <Icon
                  name="user-alt"
                  color="#5C5C5C"
                  size={20}
                  style={{paddingRight: 10, paddingLeft: 10}}
                />
                <Text style={{maxWidth: 280}}>Moulana Tariq</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <View style={{flexGrow: 1, flexDirection: 'row'}}>
                <Icon
                  name="phone-alt"
                  color="#5C5C5C"
                  size={20}
                  style={{paddingRight: 10, paddingLeft: 10}}
                />
                <Text style={{maxWidth: 280}}>+92 323 0000000</Text>
              </View>
              <View>
                <Image
                  source={{
                    uri: `${url}`,
                  }}
                  style={{
                    width: 141,
                    height: 76,
                    marginTop: -20,
                    marginRight: 10,
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingHorizontal: 15,
                paddingTop: 10,
              }}>
              <View style={{flexGrow: 1}}>
                <TouchableOpacity
                  style={{
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                    elevation: 5,
                    alignItems: 'center',
                    backgroundColor: '#ffff',
                    padding: 10,
                    borderRadius: 5,
                    width: 160,
                    marginHorizontal: 10,
                  }}
                  onPress={() => navigation.navigate('More Info')}>
                  <Text style={{color: '#364547'}}>More Info</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                    elevation: 5,
                    alignItems: 'center',
                    backgroundColor: '#ffff',
                    padding: 10,
                    borderRadius: 5,
                    width: 160,
                    marginHorizontal: 10,
                  }}>
                  <Text style={{color: '#1F441E'}}>News & Announcment</Text>
                </TouchableOpacity>
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
                <Text style={{fontSize: 17}}>{fajar}</Text>
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
                <Text style={{fontSize: 17}}>{zohar}</Text>
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
                <Text style={{fontSize: 17}}>{asar}</Text>
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
                <Text style={{fontSize: 17}}>{magrib}</Text>
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
                <Text style={{fontSize: 17}}>{isha}</Text>
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
              paddingBottom: 10,
            }}>
            <TouchableOpacity
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,
                elevation: 5,
                alignItems: 'center',
                backgroundColor: '#364547',
                padding: 10,
                borderRadius: 5,
                width: 180,
                marginHorizontal: 10,
              }}
              onPress={() => navigation.navigate('More Info')}>
              <Text style={{color: '#ffff'}}>Request Admin</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

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
