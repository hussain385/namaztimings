import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

export function GetMasjidData() {
    const [loading, setLoading] = useState(true);
    const [masjid, setMasjid] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const subs = firestore()
            .collection('Masjid')
            .onSnapshot(snapshot => {
                const masjids = [];

                snapshot.forEach(docSnapshot => {
                    masjids.push({
                        ...docSnapshot.data(),
                        key: docSnapshot.id,
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
