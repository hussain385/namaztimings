import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
// import Geolocation from 'react-native-geolocation-service';
import haversine from 'haversine';
import * as _ from 'lodash';

export function GetMasjidData() {
    const [loading, setLoading] = useState(true);
    const [masjid, setMasjid] = useState(null);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);

    // function setlocation(pos) {
    //     setLocation({
    //         'longitude': pos.coords.longitude,
    //         'latitude': pos.coords.latitude,
    //     });
    // }

    // Geolocation.getCurrentPosition((position) => {
    //         console.log('in the function');
    //         setlocation(position);
    //         console.log(position.coords.latitude, '<=============== lat');
    //     }, (err) => console.log(err), {
    //         enableHighAccuracy: true,
    //         timeout: 10000,
    //         // maximumAge: 10000,
    //     },
    // );

    function toRad(x) {
        return x * Math.PI / 180;
    }

    useEffect(() => {
        const subs = firestore()
            .collection('Masjid')
            .onSnapshot(snapshot => {
                const masjids = [];
                console.log(location);

                console.log('after the function');
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
    }, []);
    return [masjid, loading, error];
}

// export default MasjidData;
