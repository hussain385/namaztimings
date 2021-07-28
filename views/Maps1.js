/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';
import {View, ActivityIndicator, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {GetAllMasjidData} from '../store/firebase';
import {isNull} from 'lodash';

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
            coordinate={{
              latitude: Number(latitude),
              longitude: Number(longitude),
            }}>
            <Icon
              name="mosque"
              color="#1F441E"
              size={20}
              style={{paddingRight: 10, paddingLeft: 10}}
            />
          </Marker>
        </SafeAreaView>
      </MapView>
    </SafeAreaView>
  );
};

export default Maps1;
