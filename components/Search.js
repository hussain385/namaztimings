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
  ImageBackground,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';
import {GetAllMasjidData, getCurrentLocation} from '../store/firebase';
import Fuse from 'fuse.js';
import {SafeAreaView} from 'react-native';
import Favbtn from '../views/Favbtn';

const Item = ({
  url,
  title,
  distance,
  favId,
  address,
  timings,
  nav,
  onRefresh,
  latitude,
  longitude,
  user,
}) => (
  <View
    key={favId}
    style={{
      margin: 10,
      backgroundColor: '#ffff',
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 5,
    }}>
    <View>
      <ImageBackground
        source={{uri: `${url}`}}
        style={{
          flex: 1,
          resizeMode: 'cover',
          justifyContent: 'center',
          width: 391,
          height: 200,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexGrow: 1}} />
          <View style={{top: -50}}>
            <Favbtn favId={favId} onRefresh={onRefresh} />
          </View>
        </View>
      </ImageBackground>
    </View>
    <View style={{padding: 5}}>
      <View style={{flexDirection: 'row', margin: 5}}>
        <View style={{flexGrow: 1}}>
          <Text style={{fontSize: 17}}>{title}</Text>
        </View>
        <View>
          <Text style={{color: '#900000'}}>{distance}KM AWAY</Text>
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
              nav.navigate('More Info', {
                name: title,
                url: url,
                address: address,
                isha: timings.isha,
                fajar: timings.fajar,
                zohar: timings.zohar,
                asar: timings.asar,
                magrib: timings.magrib,
                favId: favId,
                distance: distance,
                latitude: latitude,
                longitude: longitude,
                user: user,
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
            onPress={() => {
              Linking.openURL(
                `https://maps.google.com/?q=${latitude},${longitude}`,
              );
            }}
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
              Locations
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const Seacrh = ({navigation}) => {
  const [masjidData, loading, error] = GetAllMasjidData();
  // const fuse = new Fuse(masjidData, {keys: ['name', 'address']});
  const [textSearch, setTextSearch] = useState('');
  const [location, setLocation] = useState();
  const [result, setResult] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  function onChangeSearch(text) {
    const fuse = new Fuse(masjidData, {keys: ['address'], distance: 400});
    const resultf = fuse.search(text);
    setTextSearch(text);
    setResult(resultf);
    console.log(resultf, text);
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
      favId={item.key}
      latitude={item.g.latitude}
      longitude={item.g.longitude}
      user={item.user}
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
      favId={item.item.key}
      latitude={item.item.g.latitude}
      user={item.item.user}
      longitude={item.item.g.longitude}
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
                placeholder="  Enter City/Area e.g Karachi/Nazimabad..."
                style={{
                  backgroundColor: '#eeee',
                  width: '80%',
                  borderRadius: 10,
                  alignContent: 'center',
                  height: 40,
                  color: '#0000',
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
                      keyExtractor={result.key}
                      style={{height: Dimensions.get('window').height - 240}}
                    />
                  );
                } else {
                  return (
                    <FlatList
                      data={masjidData}
                      renderItem={renderItem}
                      keyExtractor={masjidData.key}
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
            onPress={() => setModalVisible(true)}
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
