/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  // StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';
import {Card} from 'react-native-paper';
import {GetAllMasjidData, getCurrentLocation} from '../store/firebase';

const Item = props => (
  <TouchableOpacity
    key={props.favId}
    onPress={() =>
      props.nav.navigate('More Info', {
        name: props.title,
        url: props.url,
        address: props.address,
        isha: props.timings.isha,
        fajar: props.timings.fajar,
        zohar: props.timings.zohar,
        asar: props.timings.asar,
        magrib: props.timings.magrib,
        favId: props.favId,
        distance: props.distance,
        latitude: props.latitude,
        longitude: props.longitude,
      })
    }>
    <Card
      style={{
        borderRadius: 5,
        margin: 10,
        shadowOpacity: 10,
        elevation: 20,
      }}>
      <Card.Cover
        source={{
          uri: `${props.url}`,
        }}
      />
      <Card.Actions style={{flexDirection: 'column'}}>
        <View style={{flexDirection: 'row', margin: 5}}>
          <View style={{flexGrow: 1}}>
            <Text style={{fontSize: 17}}>{props.title}</Text>
          </View>
          <View>
            <Text style={{color: '#8D2828'}}>{props.distance} Km Away</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View style={{flexGrow: 5}}>
            <Text style={{textAlign: 'center', fontSize: 14}}>Fajar</Text>
            <Text style={{textAlign: 'center', fontSize: 14}}>
              {props.timings.fajar}
            </Text>
          </View>
          <View style={{flexGrow: 5}}>
            <Text style={{textAlign: 'center', fontSize: 14}}>Zohar</Text>
            <Text style={{textAlign: 'center', fontSize: 14}}>
              {props.timings.zohar}
            </Text>
          </View>
          <View style={{flexGrow: 5}}>
            <Text style={{textAlign: 'center', fontSize: 14}}>Asar</Text>
            <Text style={{textAlign: 'center', fontSize: 14}}>
              {props.timings.asar}
            </Text>
          </View>
          <View style={{flexGrow: 5}}>
            <Text style={{textAlign: 'center', fontSize: 14}}>Magrib</Text>
            <Text style={{textAlign: 'center', fontSize: 14}}>
              {props.timings.magrib}
            </Text>
          </View>
          <View style={{flexGrow: 5}}>
            <Text style={{textAlign: 'center', fontSize: 14}}>Isha</Text>
            <Text style={{textAlign: 'center', fontSize: 14}}>
              {props.timings.isha}
            </Text>
          </View>
        </View>
      </Card.Actions>
    </Card>
  </TouchableOpacity>
);

const ShowMore = ({navigation}) => {
  const [masjidData, loading] = GetAllMasjidData();
  const [location, setLocation] = React.useState();

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
      longitude={item.g.longitude}
      latitude={item.g.latitude}
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
      {loading && <ActivityIndicator color="#1F441E" size="large" />}
      {/* <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View>
            {masjidData !== null ? (
              masjidData.map((masjid, id) => (

              ))
            ) : (
              <ActivityIndicator size="small" color="#1F441E" />
            )}

          </View>
        </ScrollView>
      </SafeAreaView> */}

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
