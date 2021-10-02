/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  // StyleSheet,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import {Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {getCurrentLocation, sortMasjidData1} from '../store/firebase';
import {isLoaded, populate, useFirestoreConnect} from 'react-redux-firebase';
import {useSelector} from 'react-redux';

const Item = props => (
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
          name: props.title,
          url: props.url,
          address: props.address,
          timing: props.timings,
          favId: props.favId,
          distance: props.distance,
          latitude: props.latitude,
          longitude: props.longitude,
          user: props.user,
        })
      }>
      <Card.Cover
        source={{
          uri: `${props.url}`,
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
          <View style={{maxWidth: 250}}>
            <Text style={{fontSize: 17}}>{props.title}</Text>
          </View>
          <View>
            <Text
              onPress={() => {
                Linking.openURL(
                  `https://maps.google.com/?q=${props.latitude},${props.longitude}`,
                );
              }}
              style={{color: '#900000', textDecorationLine: 'underline'}}>
              {props.distance}KM AWAY
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View style={{flexGrow: 5}}>
            <Text style={{textAlign: 'center', fontSize: 14}}>Fajar</Text>
            <Text style={{textAlign: 'center', fontSize: 14}}>
              {props.timings.fajar || '--'}
            </Text>
          </View>
          <View style={{flexGrow: 5}}>
            <Text style={{textAlign: 'center', fontSize: 14}}>Zohar</Text>
            <Text style={{textAlign: 'center', fontSize: 14}}>
              {props.timings.zohar || '--'}
            </Text>
          </View>
          <View style={{flexGrow: 5}}>
            <Text style={{textAlign: 'center', fontSize: 14}}>Asar</Text>
            <Text style={{textAlign: 'center', fontSize: 14}}>
              {props.timings.asar || '--'}
            </Text>
          </View>
          <View style={{flexGrow: 5}}>
            <Text style={{textAlign: 'center', fontSize: 14}}>Magrib</Text>
            <Text style={{textAlign: 'center', fontSize: 14}}>
              {props.timings.magrib || '--'}
            </Text>
          </View>
          <View style={{flexGrow: 5}}>
            <Text style={{textAlign: 'center', fontSize: 14}}>Isha</Text>
            <Text style={{textAlign: 'center', fontSize: 14}}>
              {props.timings.isha || '--'}
            </Text>
          </View>
        </View>
      </View>
    </Card.Actions>
  </Card>
);

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
  const [location, setLocation] = React.useState({
    coords: {latitude: null, longitude: null},
  });
  const firestore = useSelector(state => state.firestore);
  const masjid = populate(firestore, 'Masjid', populates);
  const masjidData = sortMasjidData1(masjid, location.coords);
  console.log(firestore, '<===== firebase');

  React.useEffect(() => {
    getCurrentLocation()
      .then(loc => {
        setLocation(loc);
        console.log(loc.coords.longitude, '<========== location ');
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  const renderItem = ({item}) => (
    <Item
      title={item.name}
      address={item.address}
      url={item.pictureURL}
      timings={item.timing}
      nav={navigation}
      distance={item.distance}
      favId={item.key}
      longitude={item.g.geopoint.longitude}
      latitude={item.g.geopoint.latitude}
      user={item.user}
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
                latitude: location.coords.latitude || 0.0,
                longitude: location.coords.longitude || 0.0,
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
        keyExtractor={item => item.id}
        style={{marginBottom: 85}}
      />
    </View>
  );
};

export default ShowMore;
