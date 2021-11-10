import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
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
import AdminRequest from '../views/AdminRequest';
import Favbtn from '../views/Favbtn';

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

  async function onRefresh() {
    setRefreshing(true);
    await getLocation();
    await GetData();
    setRefreshing(false);
  }

  useEffect(() => {
    onRefresh();
  }, [location.latitude, location.longitude]);

  // #E1E1E1

  console.log(masjidData);
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
        // rightComponent={
        //   <TouchableOpacity
        //     style={{
        //       paddingRight: 10,
        //     }}>
        //     <View>
        //       <View style={headerStyles.cartTxt}>
        //         <CoText
        //           textStyles={[
        //             textStyles.simple,
        //             {fontSize: 10, color: '#1F441E'},
        //           ]}
        //           text="0"
        //         />
        //       </View>
        //       <MaterialIcons name="bell" size={28} color="white" />
        //     </View>
        //   </TouchableOpacity>
        // }
        backgroundColor="#1F441E"
      />
      <>
        {error.message.trim().isEmpty && (
          <View>
            <Alert>Error: {JSON.stringify(error)}</Alert>
          </View>
        )}
        {!masjidData[0] && (
          <View>
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
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    maxWidth: '99%',
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
                        maxWidth: 200,
                      }}>
                      {masjidData[0].name}
                    </Text>
                  </View>
                  <Favbtn favId={masjidData[0].key} isBig={false} />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    maxWidth: '96%',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="map-marker-alt"
                      color="#5C5C5C"
                      size={24}
                      style={{
                        paddingRight: 16,
                        paddingLeft: 15,
                        marginTop: 3,
                      }}
                    />
                    <Text style={{maxWidth: 160}}>{masjidData[0].address}</Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Icon
                      name="directions"
                      color="#900000"
                      size={24}
                      // style={{paddingRight: 7}}
                    />
                    <Text
                      onPress={async () => {
                        await Linking.openURL(`${masjidData[0].gLink}`);
                      }}
                      style={{
                        color: '#900000',
                        fontSize: 17,
                        // marginRight: 12,
                        fontWeight: 'bold',
                        textDecorationLine: 'underline',
                      }}>
                      {masjidData[0].distance} Km Away
                    </Text>
                  </View>
                </View>
                {masjidData[0].user.name !== 'No Admin' ? (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        maxWidth: '96%',
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <Icon
                          name="user-alt"
                          color="#5C5C5C"
                          size={22}
                          style={{paddingRight: 15, paddingLeft: 13}}
                        />
                        <Text style={{maxWidth: 280, marginTop: 3}}>
                          {masjidData[0].user.name || 'hussain'}
                        </Text>
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
                          size={22}
                          style={{
                            paddingRight: 15,
                            paddingLeft: 13,
                            marginTop: 3,
                          }}
                        />
                        <Text
                          style={{maxWidth: 280}}
                          onPress={async () => {
                            await Linking.openURL(
                              `tel:${masjidData[0].user.phone}`,
                            );
                          }}>
                          {masjidData[0].user.phone || '+920000000000'}
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
                        <AdminRequest id={masjidData[0].key} />
                      </View>
                      <Image
                        source={{
                          uri: `${masjidData[0].pictureURL}`,
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
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#E1E1E1',
                      padding: 10,
                      width: '100%',
                    }}>
                    <Text style={{fontSize: 17}}>Last Updated:</Text>
                    <Text
                      style={{fontSize: 17, paddingLeft: 5, color: '#008000'}}>
                      {moment(masjidData[0].timeStamp?.seconds * 1000).format(
                        'MMMM Do YYYY',
                      ) === 'Invalid date'
                        ? 'Not Available'
                        : moment(
                            masjidData[0].timeStamp?.seconds * 1000,
                          ).format('MMMM, Do YYYY')}
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
                <Text>No Favourites</Text>
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
