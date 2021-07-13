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
<<<<<<< HEAD
  const [location, setLocation] = useState(null);

<<<<<<< Updated upstream
    function setlocation(pos) {
        setLocation({
            'longitude': pos.coords.longitude,
            'latitude': pos.coords.latitude,
        });
    }

    Geolocation.getCurrentPosition((position) => {
            console.log('in the function');
            setlocation(position.coords);
            console.log(position.coords.latitude, '<=============== lat');
        }, (err) => console.log(err), {
            enableHighAccuracy: true,
            timeout: 10000,
            // maximumAge: 10000,
        },
    );

    function toRad(x) {
        return x * Math.PI / 180;
    }

    useEffect(() => {
        const subs = firestore()
            .collection('Masjid')
            .onSnapshot(snapshot => {
                const masjids = [];
                console.log(location);
=======
  // function setlocation(pos) {
  //     setLocation({
  //         'longitude': pos.coords.longitude,
  //         'latitude': pos.coords.latitude,
  //     });
  // }
//   Geolocation.getCurrentPosition(
//     position => {
//       console.log('in the function');
//       setLocation(position.coords);
//       console.log(position.coords.latitude, '<=============== lat');
//     },
//     err => console.log(err),
//     {
//       enableHighAccuracy: true,
//       timeout: 10000,
//       // maximumAge: 10000,
//     },
//   );
>>>>>>> Stashed changes

  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('in the function');
        setLocation(position.coords);
        console.log(position.coords.latitude, '<=============== lat');
      },
      err => console.log(err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        // maximumAge: 10000,
      },
    );
    const subs = firestore()
      .collection('Masjid')
      .onSnapshot(snapshot => {
        const masjids = [];
        console.log(location);

        console.log('after the function GetAllMasjidData');
        snapshot.forEach(docSnapshot => {
          const loc1 = docSnapshot.data().location;
          var d = 0;
          if (location != null) {
            const d = haversine(loc1, location);
          }

<<<<<<< Updated upstream
                });
                const masjids1 = _.sortBy(masjids, 'distance');
                console.log(masjids1);
                setMasjid(masjids1);
                setLoading(false);
            });
        return () => subs();
    }, [location]);
    return [masjid, loading, error];
=======
          console.log(d);
          masjids.push({
            ...docSnapshot.data(),
            distance: location != null ? `${d.toFixed(2)} KM` : '0 KM',
            key: docSnapshot.id,
          });
        });
        const masjids1 = _.sortBy(masjids, 'distance');
        console.log(masjids1);
        setMasjid(masjids1);
        setLoading(false);
      });
    return () => subs();
  }, []);
  return [masjid, loading, error];
>>>>>>> Stashed changes
}

export function GetRadMasjidData(radius = 50 * 1000000) {
  const [loading, setLoading] = useState(true);
  const [masjid, setMasjid] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({});
  const collections = [];

  function getCurrentLocation() {
    return new Promise((resolve, reject) =>
      Geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      }),
    );
  }

  useEffect(() => {
    getCurrentLocation().then(position => {
      const bounds = geofire.geohashQueryBounds(
        [position.coords.latitude, position.coords.longitude],
        radius,
      );
      const subs = firestore();
      for (const b of bounds) {
        const q = subs
          .collection('Masjid')
          .orderBy('location.geohash')
          .startAt(b[0])
          .endAt(b[1]);
        collections.push(q.get());
      }
      setLocation(position);
    });
    try {
      Promise.all(collections).then(value => {
        const matchingDocs = [];

        for (const snap of value) {
          for (const doc of snap.docs) {
            const lat = doc.get('location.latitude');
            const lng = doc.get('location.longitude');

            // We have to filter out a few false positives due to GeoHash
            // accuracy, but most will match
            const distanceInKm = geofire.distanceBetween(
              [lat, lng],
              [location.latitude, location.longitude],
            );
            console.log(distanceInKm, '<======= Distance in KM');
            const distanceInM = distanceInKm * 1000;
            if (distanceInKm <= radius) {
              matchingDocs.push({
                ...doc,
                distance: distanceInKm,
                key: doc.uid,
              });
            }
          }
        }
        setMasjid(matchingDocs);
        setLoading(false);
      });
    } catch (e) {
      setError(e);
    }
    return () => subs();
  }, []);
=======

  useEffect(() => {
    const subs = firestore().collection('Masjid');
    getCurrentLocation()
      .then(loc => {
        console.log(loc,'<========== location ');
        subs.onSnapshot(snapshot => {
          const masjids = [];
          console.log('after the function GetAllMasjidData');
          snapshot.forEach(docSnapshot => {
            const loc1 = docSnapshot.data().g;
            const d = haversine(loc1, loc.coords);
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
>>>>>>> 564653299dd392c0efc7723d831602e759eb9d57
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
