import _ from 'lodash';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {GetFavMasjidData} from '../store/firebase';
import Favbtn from '../views/Favbtn';

// title={item.name}
// address={item.address}
// url={item.pictureURL}
// timings={item.timing}
// nav={navigation}
// distance={item.distance}
// favId={item.key}
// onRefresh={onRefresh}
// longitude={item.g.geopoint.longitude}
// user={item.user}
// latitude={item.g.geopoint.latitude}

const Item = ({
  navigation: nav,
  item: {
    pictureURL: url,
    name: title,
    distance,
    key: favId,
    address,
    timings,
    onRefresh,
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
        nav.navigate('More Info', {
          name: title,
          url: url,
          address: address,
          timing: timings,
          favId: favId,
          distance: distance,
          latitude: latitude,
          longitude: longitude,
          user: user,
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
            <Favbtn favId={favId} onRefresh={onRefresh} isBig={true} />
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
              Linking.openURL(
                `https://maps.google.com/?q=${latitude},${longitude}`,
              );
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
            nav.navigate('More Info', {
              name: title,
              url: url,
              address: address,
              timing: timings,
              favId: favId,
              distance: distance,
              latitude: latitude,
              longitude: longitude,
              user: user,
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
            Linking.openURL(
              `https://maps.google.com/?q=${latitude},${longitude}`,
            );
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

  React.useEffect(() => {
    GetData();
    // const willFocusSubscription = navigation.addListener('focus', () => {
    //   GetData();
    // });
    // return willFocusSubscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteId]);

  return (
    <>
      <Header
        containerStyle={{
          shadowOpacity: 30,
          elevation: 10,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon1
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
              Favourites
            </Text>
          </View>
        }
        backgroundColor="#1F441E"
      />
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
                  inverted={true}
                  renderItem={Item}
                  keyExtractor={x => x.key}
                  style={{marginBottom: 60, flex: 1}}
                  onRefresh={onRefresh}
                  refreshing={refreshing}
                  initialScrollIndex={masjidData.length - 1}
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
