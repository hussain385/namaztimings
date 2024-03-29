import firestore from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';
import haversine from 'haversine';
import _ from 'lodash';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectCords, setLocation} from '../redux/locationSlicer';
import {useFavorites} from '../redux/favSlicer';
import * as Location from 'expo-location';

const GeoFirestore = geofirestore.initializeApp(firestore());
const geoCollection = GeoFirestore.collection('Masjid');

export const selectFirebase = state => state.firebase;
export const selectFirestore = state => state.firestore;

export const getCurrentLocation = async () => {
  const {status} = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    return;
  }

  return Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
};

export function modifyData(data, id, d) {
  return {
    ...data,
    key: id,
    distance: Number(d.toFixed(2)),
    timing: {
      ...data.timing,
      asar: data.timing?.asar || '01:00 PM',
      fajar: data.timing?.fajar || '04:30 PM',
      isha: data.timing?.isha || '09:30 PM',
      magrib: data.timing.magrib || '07:00 PM',
      zohar: data.timing.zohar || '05:30 PM',
    },
  };
}

export function sortMasjidData1(snapshot, {latitude, longitude}) {
  const masjids = [];

  if (_.isNil(snapshot) || _.isNil(latitude) || _.isNil(longitude)) {
    return [];
  }

  _.forEach(snapshot, (data, key) => {
    // console.log(data, 'sortMasjidData1');
    if (_.isNil(data)) {
      return;
    }
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
  // console.log('sortMasjidData1', masjids);
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
  const [masjid, setMasjid] = useState([]);
  const [error, setError] = useState({
    message: '',
  });
  const dispatch = useDispatch();
  const location = useSelector(selectCords);

  const getLocation = async () => {
    if (_.isNull(masjid)) {
      setLoading(true);
    }

    const location1 = await getCurrentLocation();
    dispatch(setLocation(location1.coords));
    setLoading(false);
  };

  async function GetDataRadMasjid() {
    // let latitude, longitude;
    // latitude = location.coords.latitude;
    // longitude = location.coords.longitude;
    geoCollection
      .near({
        center: new firestore.GeoPoint(location.latitude, location.longitude),
        radius: radius,
      })
      .get()
      .then(async snapshot => {
        // console.log(snapshot);
        const masjids1 = await sortMasjidData(snapshot, location);
        setMasjid(masjids1);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        console.log(e);
      });
  }

  return {masjid, loading, error, getLocation, GetDataRadMasjid};
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
  const [masjid, setMasjid] = useState([]);
  const [error, setError] = useState(null);
  const location = useSelector(selectCords);
  const favoriteId = useSelector(useFavorites);
  const subs = firestore().collection('Masjid');

  async function GetDataFavMasjid() {
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
      // const pos = await getCurrentLocation();
      const doc = await Promise.all(collections);
      const masjids = [];
      const users = await GetUsers();
      for (const docSnapshot of doc) {
        const data = docSnapshot.data();
        const loc1 = data.g.geopoint;
        const d = haversine(loc1, location);
        const tempData = modifyData(data, docSnapshot.id, d);
        if (tempData.announcementList) {
          const announce = tempData.announcementList?.map(async id =>
            getAnnouncement(id),
          );
          tempData.announcements = await Promise.all(announce);
        }
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
            ...tempData,
            user: {...u},
          });
        }
      }
      setMasjid(_.sortBy(masjids, 'distance'));
      setLoading(false);
    } catch (e) {
      setError(e);
    }
  }

  return {masjid, loading, error, GetDataFavMasjid};
}

const getAnnouncement = async id => {
  const data = await firestore().collection('announcement').doc(id).get();
  return {...data.data(), id: data.id};
};
