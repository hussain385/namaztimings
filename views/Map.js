import React from 'react';
import {SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {View} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

const Map = () => {
  return (
    <SafeAreaView>
      <MapView
        style={{width: '100%', height: '100%'}}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 24.859707033731326,
          longitude: 67.03126142490119,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{
            latitude: 24.859707033731326,
            longitude: 67.03126142490119,
          }}>
          <Icon
            name="mosque"
            color="#1F441E"
            size={20}
            style={{paddingRight: 10, paddingLeft: 10}}
          />
        </Marker>
      </MapView>
    </SafeAreaView>
  );
};

export default Map;
