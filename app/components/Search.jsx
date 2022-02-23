import {compose} from '@reduxjs/toolkit';
import Fuse from 'fuse.js';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect, useDispatch, useSelector} from 'react-redux';
import {firestoreConnect, isLoaded, populate} from 'react-redux-firebase';
import {getCurrentLocation, sortMasjidData1} from '../store/firebase';
import MasjidCard from '../views/MasjidCard';
import {selectCords, setLocation} from '../redux/locationSlicer';
import {ActivityIndicator} from 'react-native-paper';
import Animated, {FadeOut, Layout} from 'react-native-reanimated';

const populates = [
  {child: 'adminId', root: 'users', childAlias: 'user'}, // replace owner with user object
];

const Search = props => {
  const {navigation, masjid} = props;
  const [textSearch, setTextSearch] = useState('');
  const location = useSelector(selectCords);
  const [result, setResult] = useState(null);
  const dispatch = useDispatch();
  const masjidData = sortMasjidData1(masjid, location);

  function onChangeSearch(text) {
    const fuse = new Fuse(masjidData, {
      keys: ['address'],
      distance: 400,
      shouldSort: true,
      tokenize: true,
      matchAllTokens: true,
      findAllMatches: true,
      threshold: 1,
      maxPatternLength: 32,
      minMatchCharLength: 5,
    });
    const resultf = fuse.search(text);
    setTextSearch(text);
    setResult(resultf);
    console.log(resultf, text);
  }

  useEffect(() => {
    getCurrentLocation()
      .then(loc => {
        // setLocation(loc);
        dispatch(setLocation(loc.coords));
        // console.log(loc.coords.longitude, '<========== location ');
      })
      .catch(e => {
        console.error(e);
      });
  }, [dispatch]);

  const renderItem = ({item}) => (
    <MasjidCard
      // title={item.name}
      // address={item.address}
      // url={item.pictureURL}
      // timings={item.timing}
      masjid={item}
      nav={navigation}
      // distance={item.distance}
      // favId={item.key}
      // latitude={item.g.geopoint.latitude}
      // longitude={item.g.geopoint.longitude}
      // user={item.user}
      // gLink={item.gLink}
      // timeStamp={item.timeStamp}
    />
  );
  const renderItem1 = ({item}) => (
    <MasjidCard
      // title={item.item.name}
      // address={item.item.address}
      // url={item.item.pictureURL}
      // timings={item.item.timing}
      masjid={item.item}
      nav={navigation}
      // distance={item.item.distance}
      // favId={item.item.key}
      // latitude={item.item.g.geopoint.latitude}
      // user={item.item.user}
      // gLink={item.item.gLink}
      // timeStamp={item.item.timeStamp}
      // longitude={item.item.g.geopoint.longitude}
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
                placeholder="Enter City/Area e.g Karachi/Nazimabad..."
                style={{
                  backgroundColor: '#eeee',
                  width: '80%',
                  borderRadius: 10,
                  alignContent: 'center',
                  color: 'black',
                  height: 40,
                  paddingHorizontal: 20,
                }}
                placeholderTextColor="grey"
              />
            </View>
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
      {/* <View>
      </View> */}

      {!isLoaded(masjid) && (
        <Animated.View
          style={{
            height: Dimensions.get('screen').height * 0.7,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}
          layout={Layout}>
          <ActivityIndicator color="#1F441E" size="large" />
        </Animated.View>
      )}
      {(() => {
        if (result === null) {
          return (
            <FlatList
              data={masjidData}
              renderItem={renderItem}
              keyExtractor={item => item.key}
              style={{marginBottom: 140}}
              initialNumToRender={5}
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
                      keyExtractor={item => item.id}
                      style={{height: Dimensions.get('window').height - 240}}
                    />
                  );
                }
              })()}
            </View>
          );
        }
      })()}
      {isLoaded(masjid) && (
        <View
          style={{
            alignSelf: 'center',
            position: 'absolute',
            flex: 0.1,
            bottom: 80,
            height: 50,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Add Masjid')}
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

export default compose(
  firestoreConnect(() => [{collection: 'Masjid', populates}]),
  connect((state, props) => {
    const masjid = populate(state.firestore, 'Masjid', populates);
    return {
      ...props,
      masjid,
    };
  }),
)(Search);
