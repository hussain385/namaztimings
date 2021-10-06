import moment from 'moment';
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
import AdminRequest from './AdminRequest';
import Edit from './Edit';
import Favbtn from './Favbtn';

const MasjidInfo = ({route, navigation}) => {
  const {masjid} = route.params;
  console.log(masjid);
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
                latitude: masjid.g.geopoint.latitude,
                longitude: masjid.g.geopoint.longitude,
                name: masjid.name,
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
              <Text />
            </View>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <View style={{flexDirection: 'row', marginTop: 10}}>
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
                  {masjid.name}
                </Text>
              </View>
              <Favbtn favId={masjid.key} isBig={false} />
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
                  size={24}
                  style={{
                    paddingRight: 16,
                    paddingLeft: 15,
                    marginTop: 3,
                  }}
                />
                <Text style={{maxWidth: 200}}>{masjid.address}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="directions"
                  color="#900000"
                  size={24}
                  style={{paddingRight: 7}}
                />
                <Text
                  onPress={() => Linking.openURL(`${masjid.gLink}`)}
                  style={{
                    color: '#900000',
                    fontSize: 16,
                    marginRight: 12,
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                  }}>
                  {masjid.distance} Km Away
                </Text>
              </View>
            </View>
            {masjid.user.name !== 'No Admin' ? (
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
                      size={22}
                      style={{paddingRight: 15, paddingLeft: 13}}
                    />
                    <Text style={{maxWidth: 280}}>{masjid.user.name}</Text>
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
                      onPress={() =>
                        Linking.openURL(`tel:${masjid.user.phone}`)
                      }>
                      {masjid.user.phone}
                    </Text>
                  </View>
                  <View>
                    <Image
                      source={{
                        uri: `${masjid.pictureURL}`,
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
                    <AdminRequest id={masjid.key} />
                  </View>
                  <Image
                    source={{
                      uri: `${masjid.pictureURL}`,
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
                  padding: 10,
                  width: '100%',
                }}>
                <Text style={{fontSize: 17}}>Last Updated:</Text>
                <Text style={{fontSize: 17, marginLeft: 5, color: '#008000'}}>
                  {moment(masjid.timeStamp?.seconds * 1000).format(
                    'MMMM Do YYYY',
                  ) === 'Invalid date'
                    ? 'Not Available'
                    : moment(masjid.timeStamp?.seconds * 1000).format(
                        'MMMM, Do YYYY',
                      )}
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
                timing={masjid.timing}
                uid={masjid.key}
                adminId={masjid.user.id}
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
                <Text style={{fontSize: 17}}>{masjid.timing.fajar}</Text>
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
                <Text style={{fontSize: 17}}>{masjid.timing.zohar}</Text>
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
                <Text style={{fontSize: 17}}>{masjid.timing.asar}</Text>
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
                <Text style={{fontSize: 17}}>{masjid.timing.magrib}</Text>
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
                <Text style={{fontSize: 17}}>{masjid.timing.isha}</Text>
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
                <Text style={{fontSize: 17}}>
                  {masjid.timing.jummah || '--'}
                </Text>
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
                <Text style={{fontSize: 17}}>
                  {masjid.timing.eidUlFitr || '--'}
                </Text>
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
                <Text style={{fontSize: 17}}>
                  {masjid.timing.eidUlAddah || '--'}
                </Text>
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
              onPress={() =>
                navigation.navigate('Notification', {
                  masjidId: masjid.key,
                  masjidName: masjid.name,
                  adminId: masjid.user.id,
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
