import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {selectCords} from '../redux/locationSlicer';
import {GetRadMasjidData1} from '../store/firebase';
import LastUpdated from '../views/LastUpdated';
import TopPart from '../views/TopPart';
import {ActivityIndicator} from 'react-native-paper';
import {headerStyles, textStyles} from '../theme/styles/Base';
import CoText from '../views/Text/Text';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function HomeScreen({navigation}) {
  const {
    masjid,
    loading,
    error,
    getLocation,
    GetDataRadMasjid: GetData,
  } = new GetRadMasjidData1();
  const [refreshing, setRefreshing] = useState(false);
  const masjidData = masjid;
  const location = useSelector(selectCords);
  console.log(masjid, loading, error);
  async function onRefresh() {
    setRefreshing(true);
    await getLocation();
    await GetData();
    setRefreshing(false);
  }

  useEffect(() => {
    onRefresh().then(value => {
      console.log('refreshed');
    });
  }, [location.latitude, location.longitude]);

  // #E1E1E1
  // console.log(masjidData);
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
              Namaz Timings
            </Text>
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate('Announcement')}
            style={{
              paddingRight: 10,
            }}>
            <View>
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
        {!masjidData[0] && (
          <View
            style={{
              height: Dimensions.get('screen').height * 0.8,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <ActivityIndicator color="#1F441E" size="large" />
          </View>
        )}
        {masjidData.length !== 0 && !loading && (
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
                <TopPart masjidData={masjidData[0]} />
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <LastUpdated timeStamp={masjidData[0].timeStamp} />
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
                        masjid: masjidData[0],
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
        )}
        {masjidData === 0 && (
          <SafeAreaView>
            <ScrollView
              refreshControl={
                <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
              }>
              <View
                style={{
                  alignItems: 'center',
                  marginVertical: '50%',
                }}>
                <AntDesign name="folder1" size={50} />
                <Text>Not Available</Text>
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
