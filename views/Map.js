import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';
import {View, ActivityIndicator, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {GetAllMasjidData} from '../store/firebase';

const Map = ({route}) => {
  const [masjidData] = GetAllMasjidData();
  const {longitude} = route.params;
  const {latitude} = route.params;

  return (
    <SafeAreaView>
      <MapView
        style={{width: '100%', height: '100%'}}
        provider={PROVIDER_GOOGLE}>
        {masjidData !== null ? (
          masjidData.map((masjid, id) => (
            <>
              <Marker
                key={id}
                coordinate={{
                  latitude: Number(masjid.g.latitude),
                  longitude: Number(masjid.g.longitude),
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
                      title="my location"
                      coordinate={{
                        latitude: latitude,
                        longitude: longitude,
                      }}
                    />
                  );
                }
              })()}
            </>
          ))
        ) : (
          <></>
        )}
      </MapView>
    </SafeAreaView>
  );
};

export default Map;
