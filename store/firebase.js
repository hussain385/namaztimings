import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

export function GetMasjidData() {
    const [loading, setLoading] = useState(true);
    const [masjid, setMasjid] = useState(null);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null)

    useEffect(() => {
        Geolocation.getCurrentPosition((position) => {
                setLocation(position.coords)
                console.log(position.coords)
            }, (err) => console.log(err), {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000
            }
        )

        const subs = firestore()
            .collection('Masjid')
            .onSnapshot(snapshot => {
                const masjids = [];

                snapshot.forEach(docSnapshot => {
                    masjids.push({
                        ...docSnapshot.data(),
                        key: docSnapshot.id,
                        'distance': haversine(location, docSnapshot.data().location)
                    });
                });

                setMasjid(masjids);
                setLoading(false);

            });

        return () => subs();
    }, []);
    return [masjid, loading, error];
}

// export default MasjidData;
