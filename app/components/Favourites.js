import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {GetFavMasjidData} from '../store/firebase';
import Favbtn from '../views/Favbtn';
import HeaderComp from '../views/HeaderComp';
import {useFavorites} from '../redux/favSlicer';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
  const favoriteId = useSelector(useFavorites);

  async function onRefresh() {
    setRefreshing(true);
    await GetData();
    setRefreshing(false);
  }

  useEffect(() => {
    async function fetchData() {
      await GetData();
      // await onRefresh();
    }

    fetchData().then(r => {
      console.log(r);
    });
    // const willFocusSubscription = navigation.addListener('focus', () => {
    //   GetData();
    // });
    // return willFocusSubscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteId]);

  const Item = ({
    item: {
      donationInfo,
      pictureURL: url,
      name: title,
      distance,
      key: favId,
      address,
      timing: timing,
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
              donationInfo,
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
          source={{
            uri: `${
              url ||
              'data:image/jpeg;base64,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'
            }`,
          }}
          style={{
            flex: 1,
            resizeMode: 'cover',
            justifyContent: 'center',
            width: '100%',
            height: 200,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexGrow: 1}} />
            <View style={{top: -60, right: 10}}>
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
              onPress={async () => {
                await Linking.openURL(`${gLink}`);
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
                  donationInfo,
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
            style={[styles.btnStyles, {backgroundColor: '#1F441E'}]}>
            <Text style={{color: '#CEE6B4'}}>More Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await Linking.openURL(`${gLink}`);
            }}
            style={styles.btnStyles}>
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

const styles = StyleSheet.create({
  btnStyles: {
    alignItems: 'center',
    backgroundColor: '#CEE6B4',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: Dimensions.get('screen').width * 0.43,
  },
});

export default Favourites;
