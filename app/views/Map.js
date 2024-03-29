import React, {useState} from 'react';
import {Dimensions, SafeAreaView, Text} from 'react-native';
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {populate, useFirestoreConnect} from 'react-redux-firebase';
import {selectFirestore, sortMasjidData1} from '../store/firebase';

const window = Dimensions.get('window');
const {width, height} = window;
const LATITUD_DELTA = 0.0052;

const Map = ({navigation, route}) => {
  const [titleShow, setTitleShow] = useState('');
  const populates = [
    {child: 'adminId', root: 'users', childAlias: 'user'}, // replace owner with user object
  ];
  useFirestoreConnect([
    {
      collection: 'Masjid',
      populates,
    },
  ]);
  // const [masjidData, loading] = GetAllMasjidData();
  const {longitude} = route.params;
  const {latitude} = route.params;
  const firestore = useSelector(selectFirestore);
  const masjid = populate(firestore, 'Masjid', populates);
  const masjidData = sortMasjidData1(masjid, {latitude, longitude});

  return (
    <SafeAreaView>
      <MapView
        style={{width: '100%', height: '100%'}}
        provider={PROVIDER_GOOGLE}
        loadingEnabled={true}
        initialRegion={{
          latitude: Number(latitude),
          longitude: Number(longitude),
          latitudeDelta: LATITUD_DELTA,
          longitudeDelta: (LATITUD_DELTA * width) / height,
        }}>
        {masjidData !== null
          ? masjidData.map((masjid1, id) => (
              <SafeAreaView key={id}>
                <Marker
                  onCalloutPress={() => {
                    navigation.navigate('More Info', {masjid: masjid1});
                  }}
                  icon={require('./images/mosque2.png')}
                  coordinate={{
                    latitude: Number(masjid1.g.geopoint.latitude),
                    longitude: Number(masjid1.g.geopoint.longitude),
                  }}>
                  <>
                    <Callout>
                      <Text>{masjid1.name}</Text>
                    </Callout>
                  </>
                </Marker>
                {(() => {
                  if (latitude !== 0.0) {
                    return (
                      <Marker
                        title="Your Location"
                        coordinate={{
                          latitude: latitude,
                          longitude: longitude,
                        }}
                      />
                    );
                  }
                })()}
              </SafeAreaView>
            ))
          : null}
      </MapView>
    </SafeAreaView>
  );
};

export default Map;
