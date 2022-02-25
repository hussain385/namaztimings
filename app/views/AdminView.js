import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
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
import {isNil} from 'lodash';
import {useSelector} from 'react-redux';

const AdminView = ({navigation, route}) => {
  const {masjidId, isSingle = false, Masjid} = route.params;
  const pastTime = moment(Masjid.timeStamp?.seconds * 1000);
  const now = moment();
  const [count, setCount] = useState(0);
  const {requests} = useSelector(state => state.firestore.ordered);

  // console.log(requests, 'from admin view == requests');
  // if (!isNil(Masjid.requests)) {
  //   Masjid.requests.forEach(value => {
  //     if (!value.isRead) {
  //       setCount(prevState => prevState + 1);
  //     }
  //   });
  // }

  useEffect(() => {
    if (!isNil(Masjid.requests)) {
      setCount(0);
      Masjid.requests.forEach(value => {
        if (!value.isRead) {
          setCount(prevState => prevState + 1);
        }
      });
    }
  }, [Masjid.requests, requests]);

  console.log(isSingle, '==> masjid info');

  return (
    <>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
        }}
        leftComponent={
          <TouchableOpacity
            onPress={() =>
              isSingle ? navigation.openDrawer() : navigation.goBack()
            }>
            <Icon
              name={isSingle ? 'bars' : 'arrow-left'}
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
                masjid: masjidId,
                masjidData: Masjid,
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
                  text={count}
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
                {Masjid.name}
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
              <Text style={{maxWidth: 170, marginTop: 5}}>
                {Masjid.address}
              </Text>
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
                {Masjid.admin && Masjid.admin.name}
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
                {Masjid.admin && Masjid.admin.phone}
              </Text>
            </View>
            <View>
              <Image
                source={{
                  uri: `${
                    Masjid.pictureURL ||
                    'data:image/jpeg;base64,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'
                  }`,
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
                <Text
                  style={{
                    color: `${
                      now.diff(pastTime, 'days') <= 30 ? '#008000' : 'darkred'
                    }`,
                  }}>
                  {' '}
                  {moment(Masjid.timeStamp?.seconds * 1000).format(
                    'MMMM Do YYYY',
                  ) === 'Invalid date'
                    ? 'Not Available'
                    : moment(Masjid.timeStamp?.seconds * 1000).format(
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
              timing={Masjid.timing}
              uid={masjidId}
              isRequest={false}
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
              <Text style={{fontSize: 17}}>{Masjid.timing.fajar}</Text>
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
              <Text style={{fontSize: 17}}>{Masjid.timing.zohar}</Text>
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
              <Text style={{fontSize: 17}}>{Masjid.timing.asar}</Text>
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
              <Text style={{fontSize: 17}}>{Masjid.timing.magrib}</Text>
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
              <Text style={{fontSize: 17}}>{Masjid.timing.isha}</Text>
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
              <Text style={{fontSize: 17}}>{Masjid.timing.jummah || '--'}</Text>
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
                {Masjid.timing.eidUlFitr || '--'}
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
                {Masjid.timing.eidUlAddah || '--'}
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
                backgroundColor: '#CEE6B4',
                padding: 10,
                borderRadius: 5,
                width: '70%',
                marginHorizontal: 10,
              }}
              onPress={() =>
                navigation.navigate('Notification', {
                  masjidId: masjidId,
                  masjidName: Masjid.name,
                  adminId: Masjid.admin.id,
                })
              }>
              <Text style={{color: '#1F441E'}}>NEWS & ANNOUNCMENTS</Text>
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
              onPress={() =>
                navigation.navigate('Donation', {
                  masjidId: masjidId,
                  donationInfo:
                    Masjid.donationInfo || 'No information set by admin',
                  edit: true,
                  masjidName: Masjid.name,
                })
              }>
              <Text style={{color: '#CEE6B4'}}>Donation</Text>
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
  scrollView: {
    height: Dimensions.get('screen').height * 0.77,
    marginBottom: 10,
  },
});

export default AdminView;
