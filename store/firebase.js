/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import haversine from 'haversine';
import _ from 'lodash';
import * as geofirestore from 'geofirestore';
import appConfig from '../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GeoFirestore = geofirestore.initializeApp(firestore());
const geocollection = GeoFirestore.collection('Masjid');

export const getCurrentLocation = async () => {
  const hasPermission = await hasLocationPermission();

  if (!hasPermission) {
    return;
  }

  return new Promise((resolve, reject) =>
    Geolocation.getCurrentPosition(resolve, reject, {
      accuracy: {
        android: 'high',
        ios: 'best',
      },
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
      distanceFilter: 0,
      forceRequestLocation: true,
      forceLocationManager: false,
      showLocationDialog: true,
    }),
  );
};

export function GetAllMasjidData() {
  const [loading, setLoading] = useState(true);
  const [masjid, setMasjid] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const subs = firestore().collection('Masjid');
    getCurrentLocation()
      .then(loc => {
        // console.log(loc,'<========== location ');
        subs
          .onSnapshot(snapshot => {
            const masjids = [];
            // console.log('after the function GetAllMasjidData');
            snapshot.forEach(docSnapshot => {
              const loc1 = docSnapshot.data().g;
              const d = haversine(loc1, loc.coords);
              // console.log(d);
              masjids.push({
                ...docSnapshot.data(),
                distance: Number(d.toFixed(2)),
                key: docSnapshot.id,
              });
            });
            const masjids1 = _.sortBy(masjids, 'distance');
            // console.log(masjids1);
            setMasjid(masjids1);
            setLoading(false);
          })
          .catch(e => {
            setError(e);
            // console.log(e);
          });
      })
      .catch(e => {
        setError(e);
        // console.log(e);
      });

    return () => subs;
  }, []);
  return [masjid, loading, error];
}

export function GetRadMasjidData(radius = 500) {
  const [loading, setLoading] = useState(true);
  const [masjid, setMasjid] = useState(null);
  const [error, setError] = useState({
    message: '',
  });
  const [location, setLocation] = useState({
    coords: {
      latitude: 24.8607,
      longitude: 67.0011,
    },
  });

  useEffect(() => {
    setLoading(true);
    if (
      location.coords.latitude === 24.8607 &&
      location.coords.longitude === 67.0011
    ) {
      getCurrentLocation()
        .then(position => {
          console.log(
            position.coords.latitude,
            position.coords.longitude,
            '<===== position of promise geolocation',
          );
          setLocation(position);
          const {latitude, longitude} = position.coords;
          geocollection
            .near({
              center: new firestore.GeoPoint(latitude, longitude),
              radius: radius,
            })
            .get()
            .then(snapshot => {
              const masjids = [];
              snapshot.forEach(docSnapshot => {
                const loc1 = docSnapshot.data().g;
                const d = haversine(loc1, position.coords);

                // console.log(d);
                masjids.push({
                  ...docSnapshot.data(),
                  distance: Number(d.toFixed(2)),
                  key: docSnapshot.id,
                });
              });

              const masjids1 = _.sortBy(masjids, 'distance');
              console.log(
                masjids1,
                masjids1 === [],
                masjids1 === null,
                masjids1.length === 0,
                '<=========== GetRadMasjidData',
              );
              setMasjid(masjids1);
              setLoading(false);
            })
            .catch(e => {
              setError(e);
              console.log(e);
            });
        })
        .catch(e => {
          setError(e);
          console.log(e);
        });
    }
  }, [radius, error, location.coords]);
  return [masjid, loading, location, error];
}

export function GetRadMasjidData1(radius = 500) {
  const [loading, setLoading] = useState(true);
  const [masjid, setMasjid] = useState(null);
  const [error, setError] = useState({
    message: '',
  });
  const [location, setLocation] = useState({
    coords: {
      latitude: 24.8607,
      longitude: 67.0011,
    },
  });

  const getLocation = async () => {
    setLoading(true);
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        console.log(position, '<=========== In GetCurrpos');
      },
      error1 => {
        Alert.alert(`Code ${error1.code}`, error1.message);
        setLocation(null);
        console.log(error1);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: false,
        showLocationDialog: true,
      },
    );
  };

  function GetData() {
    let latitude, longitude;
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
    const query = geocollection
      .near({
        center: new firestore.GeoPoint(latitude, longitude),
        radius: radius,
      })
      .get()
      .then(snapshot => {
        const masjids = [];
        snapshot.forEach(docSnapshot => {
          const loc1 = docSnapshot.data().g;
          const d = haversine(loc1, {latitude, longitude});

          console.log(d);
          masjids.push({
            ...docSnapshot.data(),
            distance: Number(d.toFixed(2)),
            key: docSnapshot.id,
          });
        });

        const masjids1 = _.sortBy(masjids, 'distance');
        console.log(masjids1, '<======== from GetRadData');
        setMasjid(masjids1);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        console.log(e);
      });
    return () => query;
  }

  return [masjid, loading, location, error, getLocation, GetData];
}

export function GetFavMasjidData() {
  const [loading, setLoading] = useState(true);
  const [masjid, setMasjid] = useState(null);
  const [error, setError] = useState(null);

  async function getFavStore() {
    try {
      const value = await AsyncStorage.getItem('favorites');
      if (value !== null) {
        return JSON.parse(value);
      } else {
        return null;
      }
    } catch (e) {
      setError(e);
      console.log(e);
    }
  }

  async function setFavStore(value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('favorites', jsonValue);
    } catch (e) {
      setError(e);
      console.log(e);
    }
  }

  useEffect(() => {
    const subs = firestore().collection('Masjid');
    getFavStore().then(favorites => {
      console.log(favorites);
      if (favorites === null) {
        console.log('No Favorites Found in the storage');
        return;
      }
      const collections = [];
      favorites.forEach(fav => {
        collections.push(subs.doc(fav).get());
        console.log(fav, '<======= favs');
      });
      getCurrentLocation()
        .then(pos => {
          Promise.all(collections)
            .then(doc => {
              const masjids = [];
              doc.forEach(docSnapshot => {
                const loc1 = docSnapshot.data().g;
                const d = haversine(loc1, pos.coords);

                console.log(d);
                masjids.push({
                  ...docSnapshot.data(),
                  distance: Number(d.toFixed(2)),
                  key: docSnapshot.id,
                });
              });
              setMasjid(_.sortBy(masjids, 'distance'));
              setLoading(false);
            })
            .catch(e => {
              setError(e);
              console.log(e);
            });
        })
        .catch(e => {
          setError(e);
          console.log(e);
        });
    });
  }, [error]);
  return [masjid, loading, error];
}

const hasPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert('Location permission denied');
  }

  if (status === 'disabled') {
    Alert.alert(
      `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
      '',
      [
        {text: 'Go to Settings', onPress: openSetting},
        {text: "Don't Use Location", onPress: () => {}},
      ],
    );
  }

  return false;
};

const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }

  return false;
};
