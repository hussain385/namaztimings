/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';
import {Card} from 'react-native-paper';
import {GetAllMasjidData, getCurrentLocation} from '../store/firebase';
import Fuse from 'fuse.js';
import {SafeAreaView} from 'react-native';

const Item = props => (
  <Card
    style={{
      borderRadius: 5,
      margin: 10,
      shadowOpacity: 10,
      elevation: 20,
    }}
    key={props.key}>
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
          <Text style={{color: '#900000'}}>{props.distance} AWAY</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingHorizontal: 5,
        }}>
        <View style={{flexGrow: 1}}>
          <TouchableOpacity
            onPress={() =>
              props.nav.navigate('More Info', {
                name: props.title,
                url: props.url,
                distance: props.distance,
                address: props.address,
                isha: props.timings.isha,
                fajar: props.timings.fajar,
                zohar: props.timings.zohar,
                asar: props.timings.asar,
                magrib: props.timings.magrib,
              })
            }
            style={{
              paddingVertical: 5,
              width: 160,
              marginVertical: 10,
              borderRadius: 5,
              backgroundColor: '#364547',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: '#ffff',
              }}>
              More Info
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => props.nav.navigate('Find Masjid')}
            style={{
              paddingVertical: 5,
              width: 160,
              marginVertical: 10,
              borderRadius: 5,
              backgroundColor: '#CEE6B4',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: '#1F441E',
              }}>
              Location
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card.Actions>
  </Card>
);

const Seacrh = ({navigation}) => {
  const [masjidData, loading, error] = GetAllMasjidData();
  // const fuse = new Fuse(masjidData, {keys: ['name', 'address']});
  const [textSearch, setTextSearch] = useState('');
  const [location, setLocation] = useState();
  const [result, setResult] = useState(null);

  function onChangeSearch(text) {
    const fuse = new Fuse(masjidData, {keys: ['address']});
    const resultf = fuse.search(text);
    setTextSearch(text);
    setResult(resultf);
    console.log(text);
  }

  useEffect(() => {
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
      key={item.key}
    />
  );
  const renderItem1 = ({item}) => (
    <Item
      title={item.item.name}
      address={item.item.address}
      url={item.item.pictureURL}
      timings={item.item.timing}
      nav={navigation}
      distance={item.item.distance}
      key={item.item.key}
    />
  );
  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{zIndex: 1}}>
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
              Search
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                width: '200%',
                marginTop: 10,
              }}>
              <TextInput
                onChangeText={onChangeSearch}
                value={textSearch}
                placeholder="Enter Masjid Address..."
                style={{
                  backgroundColor: '#eeee',
                  width: '80%',
                  borderRadius: 10,
                  alignContent: 'center',
                  height: 40,
                }}
              />
            </View>
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
      {/* <View>
      </View> */}

      {loading && <ActivityIndicator color="#1F441E" size="large" />}
      {(() => {
        if (result === null) {
          return (
            <FlatList
              data={masjidData}
              renderItem={renderItem}
              keyExtractor={() => masjidData.key}
              style={{marginBottom: 140}}
            />
          );
        } else {
          return (
            <View>
              {(() => {
                if (textSearch !== '') {
                  return (
                    <FlatList
                      data={result}
                      renderItem={renderItem1}
                      keyExtractor={() => result.key}
                      style={{height: Dimensions.get('window').height - 240}}
                    />
                  );
                } else {
                  return (
                    <FlatList
                      data={masjidData}
                      renderItem={renderItem}
                      keyExtractor={() => masjidData.key}
                      style={{height: Dimensions.get('window').height - 240}}
                    />
                  );
                }
              })()}
            </View>
          );
        }
      })()}
      {!loading && (
        <View
          style={{
            alignSelf: 'center',
            position: 'absolute',
            flex: 0.1,
            bottom: 80,
            height: 50,
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              backgroundColor: '#1F441E',
              padding: 10,
              borderRadius: 5,
              width: 300,
              marginHorizontal: 10,
            }}>
            <Text style={{color: '#CEE6B4'}}>Add Masjid</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 100,
    height: Dimensions.get('window').height + 30,
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

export default Seacrh;
