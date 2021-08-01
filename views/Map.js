/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SafeAreaView} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {GetAllMasjidData} from '../store/firebase';

const Map = ({route}) => {
  const [masjidData, loading] = GetAllMasjidData();
  const {longitude} = route.params;
  const {latitude} = route.params;

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
        {masjidData !== null && !loading
          ? masjidData.map((masjid, id) => (
              <SafeAreaView key={id}>
                <Marker
                  title={`${masjid.name}`}
                  coordinate={{
                    latitude: Number(masjid.g.geopoint.latitude),
                    longitude: Number(masjid.g.geopoint.longitude),
                  }}>
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
