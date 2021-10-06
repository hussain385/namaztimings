import React from 'react';
import {SafeAreaView} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {populate, useFirestoreConnect} from 'react-redux-firebase';
import {sortMasjidData1} from '../store/firebase';

const Map = ({route}) => {
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
  const firestore = useSelector(state => state.firestore);
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
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {masjidData !== null
          ? masjidData.map((masjid, id) => (
              <SafeAreaView key={id}>
                <Marker
                  title={`${masjid.name}`}
                  coordinate={{
                    latitude: Number(masjid.g.geopoint.latitude),
                    longitude: Number(masjid.g.geopoint.longitude),
                  }}>
                  {/* <Text>{masjid.name}</Text> */}
                  <Icon
                    name="mosque"
                    color="#1F441E"
                    size={20}
                    style={{paddingRight: 10, paddingLeft: 10}}
                  />
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
