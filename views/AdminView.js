import moment from 'moment';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {headerStyles, textStyles} from '../theme/styles/Base';
import Edit from './Edit';
import CoText from './Text/Text';

const AdminView = ({navigation, route}) => {
  const {data, masjidId} = route.params;
  // const [notify, setNotify] = React.useState(0);
  console.log(masjidId);
  return (
    <>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.navigate('home')}>
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
                marginTop: 5,
                textAlign: 'center',
              }}>
              Admin
            </Text>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('adminNotification', {
                masjid: data.id,
              })
            }
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
                  text={data.requestList?.length || 0}
                />
              </View>
              <MaterialIcons name="bell" size={28} color="white" />
            </View>
          </TouchableOpacity>
        }
        backgroundColor="#1F441E"
      />
      <ScrollView style={styles.scrollView}>
        <View>
          <View>
            <Text
              style={{
                justifyContent: 'flex-start',
                fontSize: 17,
                padding: 15,
              }}>
              BASIC INFO
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
                style={{
                  fontSize: 17,
                  color: '#5C5C5C',
                  fontWeight: 'bold',
                }}>
                {data.name}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexGrow: 1, flexDirection: 'row'}}>
              <Icon
                name="map-marker-alt"
                color="#5C5C5C"
                size={20}
                style={{
                  paddingRight: 18,
                  paddingLeft: 15,
                  marginTop: 10,
                }}
              />
              <Text style={{maxWidth: 170, marginTop: 5}}>{data.address}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flexGrow: 1, flexDirection: 'row'}}>
              <Icon
                name="user-alt"
                color="#5C5C5C"
                size={20}
                style={{paddingRight: 18, paddingLeft: 13}}
              />
              <Text style={{maxWidth: 280, marginTop: 2}}>
                {data.admin && data.admin.name}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flexGrow: 1, flexDirection: 'row'}}>
              <Icon
                name="phone-alt"
                color="#5C5C5C"
                size={20}
                style={{
                  paddingRight: 18,
                  paddingLeft: 13,
                  marginTop: 5,
                }}
              />
              <Text style={{maxWidth: 280, marginTop: 0}}>
                {data.admin && data.admin.phone}
              </Text>
            </View>
            <View>
              <Image
                source={{
                  uri: `${data.pictureURL}`,
                }}
                style={{
                  width: 160,
                  height: 100,
                  marginTop: -50,
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
                <Text style={{color: '#008000'}}>
                  {moment(data.timeStamp?.seconds * 1000).format(
                    'MMMM Do YYYY',
                  ) === 'Invalid date'
                    ? 'Not Available'
                    : moment(data.timeStamp?.seconds * 1000).format(
                        'MMMM, Do YYYY',
                      )}
                </Text>
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
            <Edit
              timing={data.timing}
              uid={masjidId}
              isAdd={true}
              userInfo={false}
            />
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
              <Text style={{fontSize: 17}}>{data.timing.fajar}</Text>
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
              <Text style={{fontSize: 17}}>{data.timing.zohar}</Text>
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
              <Text style={{fontSize: 17}}>{data.timing.asar}</Text>
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
              <Text style={{fontSize: 17}}>{data.timing.magrib}</Text>
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
              <Text style={{fontSize: 17}}>{data.timing.isha}</Text>
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
              <Text style={{fontSize: 17}}>{data.timing.jummah || '--'}</Text>
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
                {data.timing.eidUlFitr || '--'}
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
                {data.timing.eidUlAddah || '--'}
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
              onPress={() =>
                navigation.navigate('Notification', {
                  masjidId: masjidId,
                  masjidName: data.name,
                  adminId: data.admin.id,
                })
              }>
              <Text style={{color: '#CEE6B4'}}>NEWS & ANNOUNCMENTS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

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

export default AdminView;
