/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';
import {GetFavMasjidData} from '../store/firebase';
import {SafeAreaView} from 'react-native-safe-area-context';
import Favbtn from '../views/Favbtn';

const Item = props => (
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
        source={{uri: `${props.url}`}}
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
            <Favbtn />
          </View>
        </View>
      </ImageBackground>
    </View>
    <View style={{padding: 5}}>
      <View style={{flexDirection: 'row', margin: 5}}>
        <View style={{flexGrow: 1}}>
          <Text style={{fontSize: 17}}>{props.title}</Text>
        </View>
        <View>
          <Text style={{color: '#900000'}}>{props.distance}KM AWAY</Text>
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
  const [masjidData, loading, error] = GetFavMasjidData();

  // function onRefresh() {
  //   setRefreshing(true);
  //   GetFavMasjidData();
  //   setRefreshing(false);
  // }

  const renderItem = ({item}) => (
    <Item
      title={item.name}
      address={item.address}
      url={item.pictureURL}
      timings={item.timing}
      nav={navigation}
      distance={item.distance}
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
              Favourites
            </Text>
          </View>
        }
        rightComponent={
          <Icon
            name="bell"
            color="#ffff"
            size={26}
            style={{paddingRight: 10}}
          />
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
          if (masjidData !== null) {
            return (
              <FlatList
                data={masjidData}
                renderItem={renderItem}
                keyExtractor={masjidData.key}
                style={{marginBottom: 140}}
                // onRefresh={() => onRefresh()}
                refreshing={refreshing}
              />
            );
          } else {
            return (
              <Text style={{textAlign: 'center', alignItems: 'center'}}>
                No Favourites
              </Text>
            );
          }
        })()}
      </SafeAreaView>
      {/* )} */}
    </View>
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
