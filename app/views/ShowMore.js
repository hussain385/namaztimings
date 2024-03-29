import * as React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import {Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {isLoaded, populate, useFirestoreConnect} from 'react-redux-firebase';
import {selectCords, setLocation} from '../redux/locationSlicer';
import {
  getCurrentLocation,
  selectFirestore,
  sortMasjidData1,
} from '../store/firebase';
import moment from 'moment';

const Item = props => {
  const pastTime = moment(props.timeStamp?.seconds * 1000);
  const now = moment();
  return (
    <Card
      style={{
        borderRadius: 5,
        margin: 10,
        shadowOpacity: 10,
        elevation: 20,
      }}>
      <TouchableOpacity
        onPress={() =>
          props.nav.navigate('More Info', {
            masjid: {
              donationInfo: props.donationInfo,
              name: props.title,
              pictureURL: props.url,
              address: props.address,
              timing: props.timings,
              key: props.favId,
              distance: props.distance,
              g: {
                geopoint: {
                  latitude: props.latitude,
                  longitude: props.longitude,
                },
              },
              user: props.user,
              gLink: props.gLink,
              timeStamp: props.timeStamp,
            },
          })
        }>
        <Card.Cover
          source={{
            uri: `${
              props.url ||
              'https://www.freepnglogos.com/uploads/masjid-png/masjid-png-clipart-best-3.png'
            }`,
          }}
        />
      </TouchableOpacity>

      <Card.Actions>
        <View style={{width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              margin: 5,
              justifyContent: 'space-between',
            }}>
            <View style={{maxWidth: Dimensions.get('screen').width * 0.65}}>
              <Text style={{fontSize: 17}}>{props.title}</Text>
            </View>
            <TouchableOpacity>
              <Text
                onPress={async () => {
                  await Linking.openURL(`${props.gLink ? props.gLink : `https://maps.google.com/?q=${props.latitude},${props.longitude}`}`);
                }}
                style={{color: '#900000', textDecorationLine: 'underline'}}>
                {props.distance}KM AWAY
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#EDEDED',
              padding: 10,
              borderRadius: 10,
            }}>
            <View style={{flexGrow: 5}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: `${
                    now.diff(pastTime, 'days') <= 30 ? '#008000' : 'darkred'
                  }`,
                }}>
                Fajar
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: `${
                    now.diff(pastTime, 'days') <= 30 ? '#008000' : 'darkred'
                  }`,
                }}>
                {props.timings.fajar.substring(0, 5) || '--'}
              </Text>
            </View>
            <View style={{flexGrow: 5}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: `${
                    now.diff(pastTime, 'days') <= 30 ? '#008000' : 'darkred'
                  }`,
                }}>
                Zohar
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: `${
                    now.diff(pastTime, 'days') <= 30 ? '#008000' : 'darkred'
                  }`,
                }}>
                {props.timings.zohar.substring(0, 5) || '--'}
              </Text>
            </View>
            <View style={{flexGrow: 5}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: `${
                    now.diff(pastTime, 'days') <= 30 ? '#008000' : 'darkred'
                  }`,
                }}>
                Asar
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: `${
                    now.diff(pastTime, 'days') <= 30 ? '#008000' : 'darkred'
                  }`,
                }}>
                {props.timings.asar.substring(0, 5) || '--'}
              </Text>
            </View>
            <View style={{flexGrow: 5}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: `${
                    now.diff(pastTime, 'days') <= 30 ? '#008000' : 'darkred'
                  }`,
                }}>
                Magrib
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: `${
                    now.diff(pastTime, 'days') <= 30 ? '#008000' : 'darkred'
                  }`,
                }}>
                {props.timings.magrib.substring(0, 5) || '--'}
              </Text>
            </View>
            <View style={{flexGrow: 5}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: `${
                    now.diff(pastTime, 'days') <= 30 ? '#008000' : 'darkred'
                  }`,
                }}>
                Isha
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: `${
                    now.diff(pastTime, 'days') <= 30 ? '#008000' : 'darkred'
                  }`,
                }}>
                {props.timings.isha.substring(0, 5) || '--'}
              </Text>
            </View>
          </View>
        </View>
      </Card.Actions>
    </Card>
  );
};

const ShowMore = ({navigation}) => {
  // const [masjidData, loading] = GetAllMasjidData();
  const populates = [
    {child: 'adminId', root: 'users', childAlias: 'user'}, // replace owner with user object
  ];
  useFirestoreConnect([
    {
      collection: 'Masjid',
      populates,
    },
  ]);
  const location = useSelector(selectCords);
  const firestore = useSelector(selectFirestore);
  const masjid = populate(firestore, 'Masjid', populates);
  const dispatch = useDispatch();
  const masjidData = sortMasjidData1(masjid, location);

  React.useEffect(() => {
    getCurrentLocation()
      .then(loc => {
        // setLocation(loc);
        dispatch(setLocation(loc.coords));
      })
      .catch(e => {
        console.log(e);
      });
  }, [dispatch]);

  const renderItem = ({item}) => (
    <Item
      title={item.name}
      address={item.address}
      url={item.pictureURL}
      donationInfo={item.donationInfo}
      timings={item.timing}
      nav={navigation}
      distance={item.distance}
      favId={item.key}
      longitude={item.g.geopoint.longitude}
      latitude={item.g.geopoint.latitude}
      user={item.user}
      gLink={item.gLink}
      timeStamp={item.timeStamp}
    />
  );
  return (
    <View>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
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
                marginTop: 5,
                textAlign: 'center',
              }}>
              More Masjid
            </Text>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Map', {
                latitude: location.latitude || 0.0,
                longitude: location.longitude || 0.0,
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
      {!isLoaded(masjid) && <ActivityIndicator color="#1F441E" size="large" />}
      <FlatList
        data={masjidData}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        initialNumToRender={20}
        style={{marginBottom: 85}}
      />
    </View>
  );
};

export default ShowMore;
