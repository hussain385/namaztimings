import firestore from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';
import haversine from 'haversine';
import _ from 'lodash';
import {useEffect, useState} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useSelector} from 'react-redux';
import appConfig from '../app.json';

const GeoFirestore = geofirestore.initializeApp(firestore());
const geoCollection = GeoFirestore.collection('Masjid');

export const getCurrentLocation = async () => {
  const hasPermission = await hasLocationPermission();

  if (!hasPermission) {
    return null;
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

export function modifyData(data, id, d) {
  return {
    ...data,
    key: id,
    distance: Number(d.toFixed(2)),
    timing: {
      asar: !_.isUndefined(data.timing)
        ? !_.isUndefined(data.timing.asar) && data.timing.asar
        : '01:00 PM',
      fajar: !_.isUndefined(data.timing)
        ? !_.isUndefined(data.timing.fajar) && data.timing.fajar
        : '04:30 PM',
      isha: !_.isUndefined(data.timing)
        ? !_.isUndefined(data.timing.isha) && data.timing.isha
        : '09:30 PM',
      magrib: !_.isUndefined(data.timing)
        ? !_.isUndefined(data.timing.magrib) && data.timing.magrib
        : '07:00 PM',
      zohar: !_.isUndefined(data.timing)
        ? !_.isUndefined(data.timing.zohar) && data.timing.zohar
        : '05:30 PM',
    },
  };
}
export function sortMasjidData1(snapshot, {latitude, longitude}) {
  const masjids = [];

  if (
    _.isUndefined(snapshot) ||
    _.isUndefined(latitude) ||
    _.isUndefined(longitude)
  ) {
    return [];
  }

  _.map(snapshot, (data, key) => {
    const loc1 = data.g.geopoint;
    const d = haversine(loc1, {latitude, longitude});
    const tempData = modifyData(data, key, d);
    // console.log(data, tempData, '<======== tempData');
    const adminId = tempData.adminId;
    // console.log(adminId, _.isEmpty(adminId), typeof adminId);
    if (_.isEmpty(adminId)) {
      // console.log('when True');
      masjids.push({
        ...tempData,
        user: {
          name: 'No Admin',
          phone: '**********',
        },
      });
    } else {
      masjids.push(tempData);
    }
  });
  console.log('sortMasjidData1', masjids);
  return _.sortBy(masjids, 'distance');
}

export async function sortMasjidData(snapshot, {latitude, longitude}) {
  const masjids = [];
  const users = await GetUsers();
  snapshot.forEach(docSnapshot => {
    const data = docSnapshot.data();
    const loc1 = data.g.geopoint;
    const d = haversine(loc1, {latitude, longitude});
    const tempData = modifyData(data, docSnapshot.id, d);
    // console.log(tempData, '<======== tempData');
    const adminId = tempData.adminId;
    console.log(adminId, _.isEmpty(adminId), typeof adminId);
    if (_.isEmpty(adminId)) {
      // console.log('when True');
      masjids.push({
        ...tempData,
        user: {
          name: 'No Admin',
          phone: '**********',
        },
      });
    } else {
      const u = _.find(users, o => {
        return o.uid === adminId;
      });
      masjids.push({
        ...tempData,
        user: {...u},
      });
    }
  });
  return _.sortBy(masjids, 'distance');
}

export function GetRadMasjidData1(radius = 50) {
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
    if (_.isNull(masjid)) {
      setLoading(true);
    }

    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        console.log(position, '<=========== In GetCurr');
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

  async function GetData() {
    let latitude, longitude;
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
    geoCollection
      .near({
        center: new firestore.GeoPoint(latitude, longitude),
        radius: radius,
      })
      .get()
      .then(async snapshot => {
        const masjids1 = await sortMasjidData(snapshot, location.coords);
        setMasjid(masjids1);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        console.log(e);
      });
  }

  return {masjid, loading, location, error, getLocation, GetData};
}

function GetUsers() {
  return new Promise((resolve, reject) => {
    try {
      firestore()
        .collection('users')
        .get()
        .then(d => {
          const data = [];
          d.forEach(doc => {
            data.push({...doc.data(), uid: doc.id, id: doc.id});
          });
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function GetFavMasjidData() {
  const [loading, setLoading] = useState(true);
  const [masjid, setMasjid] = useState(null);
  const [error, setError] = useState(null);
  const favoriteId = useSelector(state => state.favorites.value);
  const subs = firestore().collection('Masjid');

  async function GetData() {
    if (_.isNull(masjid)) {
      setLoading(true);
    }
    console.log('%c triggered the GetData from Faves', 'color: #bada55');
    const favorites = favoriteId;
    console.log(favorites, '<=========== favs from redux');
    if (_.isNull(favorites)) {
      console.log('No Favorites Found in the storage');
      setLoading(false);
      return;
    }
    const collections = [];
    favorites.forEach(fav => {
      if (!_.isNull(fav) && !_.isUndefined(fav)) {
        collections.push(subs.doc(fav).get());
        console.log(fav, '<======= faves from getFavData');
      }
    });
    try {
      const pos = await getCurrentLocation();
      const doc = await Promise.all(collections);
      const masjids = [];
      const users = await GetUsers();
      doc.forEach(docSnapshot => {
        const data = docSnapshot.data();
        const loc1 = data.g.geopoint;
        const d = haversine(loc1, pos.coords);
        const tempData = modifyData(data, docSnapshot.id, d);
        const adminId = tempData.adminId;
        if (_.isEmpty(adminId)) {
          masjids.push({
            ...tempData,
            user: {
              name: 'No Admin',
              phone: '**********',
            },
          });
        } else {
          const u = _.find(users, o => {
            return o.uid === adminId;
          });
          masjids.push({
            ...docSnapshot.data(),
            user: {...u},
          });
        }
      });
      setMasjid(_.sortBy(masjids, 'distance'));
      setLoading(false);
    } catch (e) {
      setError(e);
    }
  }

  return [masjid, loading, error, GetData];
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
        {
          text: "Don't Use Location",
          onPress: () => {},
        },
      ],
    );
  }

  return false;
};

const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    return await hasPermissionIOS();
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
