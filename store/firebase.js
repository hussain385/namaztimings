/* eslint-disable prettier/prettier */
import {useEffect, useState} from 'react';
import {Alert, Linking, PermissionsAndroid, Platform, ToastAndroid,} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import haversine from 'haversine';
import _ from 'lodash';
import * as geofirestore from 'geofirestore';
import appConfig from '../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GeoFirestore = geofirestore.initializeApp(firestore());
const geoCollection = GeoFirestore.collection('Masjid');

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

async function sortMasjidData(snapshot, {latitude, longitude}) {
    const masjids = [];
    const users = await GetUsers();
    snapshot.forEach(docSnapshot => {
        const data = docSnapshot.data()
        const loc1 = data.g.geopoint;
        const d = haversine(loc1, {latitude, longitude});
        const tempData = {
            name: data.name,
            address: data.address,
            pictureURL: data.pictureURL,
            adminId: data.adminId || "",
            key: docSnapshot.id,
            distance: Number(d.toFixed(2)),
            g: {
                geohash: data.g.geohash,
                geopoint: data.g.geopoint,
            },
            timing: {
                asar: data.timing.asar || "01:00 PM",
                fajar: data.timing.fajar || "04:30 PM",
                isha: data.timing.isha || "09:30 PM",
                magrib: data.timing.magrib || "07:00 PM",
                zohar: data.timing.zohar || "05:30 PM",
            },
        }
        const adminId = tempData.adminId;
        console.log(adminId, _.isEmpty(adminId), typeof adminId);
        if (_.isEmpty(adminId)) {
            console.log('when True');
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

export function GetAllMasjidData() {
    const [loading, setLoading] = useState(true);
    const [masjid, setMasjid] = useState();
    const [error, setError] = useState(null);

    useEffect(() => {
        const subs = firestore().collection('Masjid');
        getCurrentLocation().then(loc => {
            subs.onSnapshot(async snapshot => {
                const masjids1 = await sortMasjidData(snapshot, loc.coords);
                setMasjid(masjids1);
                setLoading(false);
            });
        });
        return () => subs;
    }, []);
    return [masjid, loading, error];
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
        const query = geoCollection
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
        return () => query;
    }

    return [masjid, loading, location, error, getLocation, GetData];
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
                        data.push({...doc.data(), uid: doc.id});
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
    const subs = firestore().collection('Masjid');

    async function getFavStore() {
        try {
            const value = await AsyncStorage.getItem('favorites');
            if (!_.isNull(value)) {
                return JSON.parse(value);
            } else {
                return null;
            }
        } catch (e) {
            setError(e);
            console.log(e);
        }
    }

    async function GetData() {
        setLoading(true);
        console.log('%c triggered the GetData from Faves', 'color: #bada55');
        const favorites = await getFavStore();
        console.log(favorites);
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
        const pos = await getCurrentLocation();
        const doc = await Promise.all(collections);
        const masjids = [];
        const users = await GetUsers();
        doc.forEach(docSnapshot => {
            const data = docSnapshot.data();
            const loc1 = data.g.geopoint;
            const d = haversine(loc1, pos.coords);
            const tempData = {
                name: data.name,
                address: data.address,
                pictureURL: data.pictureURL,
                adminId: data.adminId || "",
                key: docSnapshot.id,
                distance: Number(d.toFixed(2)),
                g: {
                    geohash: data.g.geohash,
                    geopoint: data.g.geopoint,
                },
                timing: {
                    asar: data.timing.asar || "01:00 PM",
                    fajar: data.timing.fajar || "04:30 PM",
                    isha: data.timing.isha || "09:30 PM",
                    magrib: data.timing.magrib || "07:00 PM",
                    zohar: data.timing.zohar || "05:30 PM",
                },
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
                    ...docSnapshot.data(),
                    user: {...u},
                });
            }
        });
        setMasjid(_.sortBy(masjids, 'distance'));
        setLoading(false);
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
                    onPress: () => {
                    },
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
