/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Header} from 'react-native-elements';
import {GetFavMasjidData} from '../store/firebase';
import {SafeAreaView} from 'react-native-safe-area-context';
import Favbtn from '../views/Favbtn';
import _ from 'lodash';

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
}) => (
  <View
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

const Favourites = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  //   const [masjidData, loading, error] = GetRadMasjidData();
  const [masjidData, loading, error, GetData] = GetFavMasjidData();

  function onRefresh() {
    setRefreshing(true);
    GetData();
    setRefreshing(false);
  }

  React.useEffect(() => {
    onRefresh();
    const willFocusSubscription = navigation.addListener('focus', () => {
      onRefresh();
    });
    return willFocusSubscription;
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
      onRefresh={onRefresh}
      longitude={item.g.longitude}
      latitude={item.g.latitude}
    />
  );
  return (
    <>
      <Header
        containerStyle={{
          shadowOpacity: 30,
          elevation: 10,
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
              Favourites
            </Text>
          </View>
        }
        backgroundColor="#1F441E"
      />
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
      {/* {loading ? (
        <ActivityIndicator color="#1F441E" size="large" />
      ) : ( */}
      <SafeAreaView>
        {(() => {
          if (!loading) {
            if (!_.isNull(masjidData) && !_.isEmpty(masjidData)) {
              return (
                <FlatList
                  data={masjidData}
                  renderItem={renderItem}
                  keyExtractor={x => x.key}
                  style={{marginBottom: 140}}
                  onRefresh={() => onRefresh()}
                  refreshing={refreshing}
                />
              );
            } else {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    marginVertical: '50%',
                  }}>
                  <AntDesign name="folder1" size={50} />
                  <Text>No Favourites</Text>
                </View>
              );
            }
          } else {
            return <ActivityIndicator color="#1F441E" size="large" />;
          }
        })()}
      </SafeAreaView>
    </>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginBottom: 60,
//   },
//   mncontainer: {
//     flex: 1,
//     marginTop: 30,
//   },
//   navigationContainer: {
//     backgroundColor: '#1F441E',
//   },
//   paragraph: {
//     padding: 16,
//     fontSize: 15,
//     textAlign: 'center',
//   },
// });

export default Favourites;
