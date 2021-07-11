import * as React from 'react';
import {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';
import {Card} from 'react-native-paper';
import {GetMasjidData} from '../store/firebase';
import CountrySelectDropdown from 'react-native-searchable-country-dropdown';

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
  const {getCode, getName} = require('country-list');
  const {CountryCode, setCountryCode} = useState('');
  const [masjidData, loading, error] = GetAllMasjidData();

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
  return (
    <View style={styles.container}>
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
                textAlign: 'center',
              }}>
              Search
            </Text>
          </View>
        }
        rightComponent={
          <Icon
            name="map-marker-alt"
            color="#ffff"
            size={26}
            style={{paddingRight: 10}}
          />
        }
        backgroundColor="#1F441E"
      />
      <View style={{marginTop: 10, marginHorizontal: 30}}>
        <CountrySelectDropdown
          countrySelect={setCountryCode}
          error="No Country Found"
          fontFamily={'Nunito-Regular'}
          textColor={'#000000'}
        />
      </View>

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
      <View style={{marginTop: 50}}>
        <FlatList
          data={masjidData}
          renderItem={renderItem}
          keyExtractor={masjidData => masjidData.key}
          style={{marginBottom: 140}}
        />
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 50,
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
