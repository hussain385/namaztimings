import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
// import Geolocation from 'react-native-geolocation-service';
import haversine from 'haversine';
import geofire from 'geofire-common';
import * as _ from 'lodash';

export function GetAllMasjidData() {
    const [loading, setLoading] = useState(true);
    const [masjid, setMasjid] = useState(null);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);

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

                console.log('after the function GetAllMasjidData');
                snapshot.forEach(docSnapshot => {
                    const loc1 = docSnapshot.data().location;
                    var d = 0
                    if (location != null) {
                        const d = haversine(loc1, location);
                    }

                    console.log(d);
                    masjids.push({
                        ...docSnapshot.data(),
                        'distance': location != null ? `${d.toFixed(2)} KM` : '0 KM',
                        'key': docSnapshot.id,

                    });

                });
                const masjids1 = _.sortBy(masjids, 'distance');
                console.log(masjids1);
                setMasjid(masjids1);
                setLoading(false);
            });
        return () => subs();
    }, [location]);
    return [masjid, loading, error];
}

export function GetRadMasjidData(radius: number = 50*1000000) {
    const [loading, setLoading] = useState(true);
    const [masjid, setMasjid] = useState(null);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState({});
    const collections = []

    function getCurrentLocation() {
        return new Promise((resolve, reject) => Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 10000,
        }));
    }


    useEffect(() => {
        getCurrentLocation().then((position) => {
            const bounds = geofire.geohashQueryBounds([position.coords.latitude, position.coords.longitude], radius);
            const subs = firestore()
            for (const b of bounds) {
                const q = subs.collection('Masjid')
                    .orderBy('location.geohash')
                    .startAt(b[0]).endAt(b[1]);
                collections.push(q.get())
            }
            setLocation(position)
        })
        try {
            Promise.all(collections).then(value => {
                const matchingDocs = []

                for (const snap of value) {
                    for (const doc of snap.docs) {
                        const lat = doc.get('location.latitude');
                        const lng = doc.get('location.longitude');

                        // We have to filter out a few false positives due to GeoHash
                        // accuracy, but most will match
                        const distanceInKm = geofire.distanceBetween([lat, lng], [location.latitude, location.longitude]);
                        console.log(distanceInKm, '<======= Distance in KM')
                        const distanceInM = distanceInKm * 1000;
                        if (distanceInKm <= radius) {
                            matchingDocs.push({
                                ...doc,
                                'distance': distanceInKm,
                                'key': doc.uid
                            });
                        }
                    }
                }
                setMasjid(matchingDocs);
                setLoading(false);
            });
        } catch (e) {
            setError(e)
        }
        return () => subs();
    }, []);
    return [masjid, loading, error];
}

// export default MasjidData;
