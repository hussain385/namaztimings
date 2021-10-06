import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {GetFavMasjidData} from '../store/firebase';
import Favbtn from '../views/Favbtn';
import HeaderComp from '../views/HeaderComp';

// title={item.name}
// address={item.address}
// url={item.pictureURL}
// timing={item.timing}
// nav={navigation}
// distance={item.distance}
// favId={item.key}
// onRefresh={onRefresh}
// longitude={item.g.geopoint.longitude}
// user={item.user}
// latitude={item.g.geopoint.latitude}

const Favourites = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  //   const [masjidData, loading, error] = GetRadMasjidData();
  const {
    masjid: masjidData,
    loading,
    error,
    GetDataFavMasjid: GetData,
  } = GetFavMasjidData();
  const favoriteId = useSelector(state => state.favorites.value);
  async function onRefresh() {
    setRefreshing(true);
    await GetData();
    setRefreshing(false);
  }

  useEffect(() => {
    async function fetchData() {
      await GetData();
    }
    fetchData();
    // const willFocusSubscription = navigation.addListener('focus', () => {
    //   GetData();
    // });
    // return willFocusSubscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteId]);

  const Item = ({
    item: {
      pictureURL: url,
      name: title,
      distance,
      key: favId,
      address,
      timing: timing,
      onRefresh,
      gLink,
      timeStamp,
      g: {
        geopoint: {latitude, longitude},
      },
      user,
    },
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
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('More Info', {
            masjid: {
              pictureURL: url,
              name: title,
              distance,
              key: favId,
              address,
              timing,
              onRefresh,
              gLink,
              timeStamp,
              g: {
                geopoint: {latitude, longitude},
              },
              user,
            },
          })
        }>
        <ImageBackground
          source={{uri: `${url}`}}
          style={{
            flex: 1,
            resizeMode: 'cover',
            justifyContent: 'center',
            width: '100%',
            height: 200,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexGrow: 1}} />
            <View style={{top: -50}}>
              <Favbtn favId={favId} isBig={true} />
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <View style={{padding: 5}}>
        <View
          style={{
            flexDirection: 'row',
            margin: 5,
            justifyContent: 'space-between',
          }}>
          <View style={{maxWidth: 250}}>
            <Text style={{fontSize: 17}}>{title}</Text>
          </View>
          <View>
            <Text
              onPress={() => {
                Linking.openURL(`${gLink}`);
              }}
              style={{color: '#900000', textDecorationLine: 'underline'}}>
              {distance}KM AWAY
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingHorizontal: 5,
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('More Info', {
                masjid: {
                  pictureURL: url,
                  name: title,
                  distance,
                  key: favId,
                  address,
                  timing,
                  onRefresh,
                  gLink,
                  timeStamp,
                  g: {
                    geopoint: {latitude, longitude},
                  },
                  user,
                },
              })
            }
            style={{
              alignItems: 'center',
              backgroundColor: '#1F441E',
              padding: 10,
              borderRadius: 5,
              width: '47%',
              marginVertical: 10,
              marginHorizontal: 10,
            }}>
            <Text style={{color: '#CEE6B4'}}>More Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`${gLink}`);
            }}
            style={{
              alignItems: 'center',
              padding: 10,
              borderRadius: 5,
              width: '47%',
              marginVertical: 10,
              marginHorizontal: 10,
              backgroundColor: '#CEE6B4',
            }}>
            <Text
              style={{
                color: '#1F441E',
              }}>
              Location
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <HeaderComp navigation={navigation} heading="Favourites" />
      <>
        {(() => {
          if (error) {
            return <Text>{JSON.stringify(error, null, 2)}</Text>;
          }
          if (!loading) {
            if (!_.isNull(masjidData) && !_.isEmpty(masjidData)) {
              console.log(masjidData, '<==== from fav page');
              return (
                <FlatList
                  data={masjidData}
                  renderItem={Item}
                  keyExtractor={x => x.key}
                  style={{marginBottom: 70, flex: 1}}
                  onRefresh={onRefresh}
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
      </>
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
