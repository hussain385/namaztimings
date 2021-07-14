/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import haversine from 'haversine';
import _ from 'lodash';
import * as geofirestore from 'geofirestore';

const GeoFirestore = geofirestore.initializeApp(firestore());
const geocollection = GeoFirestore.collection('Masjid');

function getCurrentLocation() {
  return new Promise((resolve, reject) =>
    Geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000,
    }),
  );
}


export function GetAllMasjidData() {
  const [loading, setLoading] = useState(true);
  const [masjid, setMasjid] = useState(null);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const subs = firestore().collection('Masjid');
    getCurrentLocation()
      .then(loc => {
        // console.log(loc,'<========== location ');
        subs.onSnapshot(snapshot => {
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

    return () => subs();
  }, []);
  return [masjid, loading, error];
}

export function GetRadMasjidData(radius = 50) {
  const [loading, setLoading] = useState(true);
  const [masjid, setMasjid] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentLocation()
      .then(position => {
        console.log(
          position.coords.latitude,
          position.coords.longitude,
          '<===== position of promise geolocation',
        );
        const { latitude, longitude } = position.coords;
        const query = geocollection.near({center: new firestore.GeoPoint(latitude,longitude),radius: radius});
        query.get().then(snapshot => {
          const masjids = [];
          snapshot.forEach((docSnapshot)=>{

            const loc1 = docSnapshot.data().g;
            const d = haversine(loc1, position.coords);

            console.log(d);
            masjids.push({
              ...docSnapshot.data(),
              distance: Number(d.toFixed(2)),
              key: docSnapshot.id,
            });
          });

          const masjids1 = _.sortBy(masjids, 'distance');
          console.log(masjids1);
          setMasjid(masjids1);
          setLoading(false);
        }).catch(e => {
          setError(e);
          console.log(e);
        });
      })
      .catch(e => {
        setError(e);
        console.log(e);
      });
  }, [radius]);
  return [masjid, loading, error];
}

export function GetFavMasjidData(favorites) {
  const [loading, setLoading] = useState(true);
  const [masjid, setMasjid] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(()=> {
    const subs = firestore().collection('Masjid');
    const collections = [];

    Geolocation().then((pos)=> {
      setLocation(pos.coords);
    })
    .catch(e => {
      setError(e);
      console.log(e);
    });
    favorites.forEach((fav)=> {
      collections.push(subs.doc(fav).get());
    });
    Promise.all(collections).then((doc)=> {
      const masjids = [];
      doc.forEach((docSnapshot)=>{

        const loc1 = docSnapshot.data().g;
        const d = haversine(loc1, location);

        console.log(d);
        masjids.push({
          ...docSnapshot.data(),
          distance: Number(d.toFixed(2)),
          key: docSnapshot.id,
        });
      });
      setMasjid(_.sortBy(masjids, 'distance'));
      setLoading(false);
    }).catch(e => {
      setError(e);
      console.log(e);
    });
  },[favorites, location]);
  return [masjid, loading, error];
}