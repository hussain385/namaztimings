import React from 'react';
import {SafeAreaView} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Maps1 = ({route}) => {
  const {longitude} = route.params;
  const {latitude} = route.params;
  const {name} = route.params;

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
        <SafeAreaView>
          <Marker
            title={`${name}`}
            icon={require('./images/mosque5.png')}
            coordinate={{
              latitude: Number(latitude),
              longitude: Number(longitude),
            }}
          />
        </SafeAreaView>
      </MapView>
    </SafeAreaView>
  );
};

export default Maps1;
