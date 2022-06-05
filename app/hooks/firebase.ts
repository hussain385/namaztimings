import firestore from "@react-native-firebase/firestore"
import * as geofirestore from "geofirestore"
import haversine from "haversine"
import _ from "lodash"
import React, { useMemo, useState } from "react"
import { selectCords, setLocation } from "../redux/locationSlicer"
import { useFavorites } from "../redux/favSlicer"
import * as Location from "expo-location"
import { RootState } from "../redux/store"
import { GeoQuerySnapshot } from "geofirestore-core"
import { Announcement, Masjid, User } from "../types/firestore"
import { useAppDispatch, useAppSelector } from "./redux"
import firebase from "@react-native-firebase/app"
import { populate, useFirestoreConnect } from "react-redux-firebase"

// @ts-ignore
const GeoFirestore = geofirestore.initializeApp(firebase.firestore())
const geoCollection = GeoFirestore.collection("Masjid")

export const selectFirebase = (state: RootState) => state.firebase
export const selectFirestore = (state: RootState) => state.firestore

export const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync()

  if (status !== "granted") {
    return
  }

  return Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  })
}

export function modifyData(
  data: geofirestore.GeoFirestoreTypes.GeoDocumentData | Masjid,
  id: string,
  d: number,
): Masjid {
  return {
    ...(data as Masjid),
    uid: id,
    distance: Number(d.toFixed(2)),
    timing: {
      ...data.timing,
      asar: data.timing?.asar || "01:00 PM",
      fajar: data.timing?.fajar || "04:30 PM",
      isha: data.timing?.isha || "09:30 PM",
      magrib: data.timing.magrib || "07:00 PM",
      zohar: data.timing.zohar || "05:30 PM",
    },
  }
}

export function sortMasjidData1(
  snapshot: any[],
  { latitude, longitude }: { latitude?: number; longitude?: number },
): Masjid[] {
  const masjids: any[] = []

  if (_.isNil(snapshot) || _.isNil(latitude) || _.isNil(longitude)) {
    return []
  }

  _.forEach(snapshot, (data: Masjid, key: string) => {
    // console.log(data, 'sortMasjidData1');
    if (_.isNil(data)) {
      return
    }
    const loc1 = data.g.geopoint
    const d = haversine(loc1, { latitude, longitude })
    const tempData = modifyData(data, key, d)
    // console.log(data, tempData, '<======== tempData');
    const adminId = tempData.adminId
    // console.log(adminId, _.isEmpty(adminId), typeof adminId);
    if (_.isEmpty(adminId)) {
      // console.log('when True');
      masjids.push({
        ...tempData,
        user: {
          name: "No Admin",
          phone: "**********",
        },
      })
    } else {
      masjids.push(tempData)
    }
  })
  // console.log('sortMasjidData1', masjids);
  return _.sortBy(masjids, "distance")
}

function sortMasjidDataHandle(tempData: Masjid, users: User[]): Masjid[] {
  const masjids: Masjid[] = []
  const adminId = tempData.adminId
  // console.log(adminId, _.isEmpty(adminId), typeof adminId);
  if (_.isEmpty(adminId)) {
    // console.log('when True');
    masjids.push({
      ...tempData,
      user: {
        name: "No Admin",
        phone: "**********",
        email: "none@none.com",
      },
    })
  } else {
    const u = _.find(users, (o) => {
      return o.uid === adminId
    })
    if (u) {
      masjids.push({
        ...tempData,
        user: { ...u },
      })
    }
  }
  console.log(masjids, "from sortMasjidDataHandle")
  return masjids
}

export async function sortMasjidData(
  snapshot: GeoQuerySnapshot,
  { latitude, longitude }: { latitude: number; longitude: number },
) {
  const masjids: Masjid[] = []
  const users = await GetUsers()
  console.log(snapshot)
  console.log(snapshot.docs, "users from sortMasjidData")
  _.forEach(snapshot.docs, (docSnapshot) => {
    const data = docSnapshot.data()
    console.log(data, "data from sortMasjidData")
    const loc1 = data.g.geopoint
    const d = haversine(loc1, { latitude, longitude })
    const tempData = modifyData(data, docSnapshot.id, d)
    console.log(tempData, "tempData from sortMasjidData")
    masjids.push(...sortMasjidDataHandle(tempData, users))
  })
  return _.sortBy(masjids, "distance")
}

export function useGetRadMasjidData1(radius = 50) {
  const [loading, setLoading] = useState(true)
  const [masjid, setMasjid] = useState<Masjid[]>([])
  const [error, setError] = useState({
    message: "",
  })
  const dispatch = useAppDispatch()
  const location = useAppSelector(selectCords)

  const getLocation = async () => {
    if (_.isNull(masjid)) {
      setLoading(true)
    }

    const location1 = await getCurrentLocation()
    if (location1) {
      dispatch(setLocation(location1.coords))
    }
    setLoading(false)
  }

  async function GetDataRadMasjid() {
    geoCollection
      .near({
        center: new firestore.GeoPoint(location.latitude, location.longitude),
        radius: 5000,
      })
      .get()
      .then(
        async (snapshot) => {
          const masjids1 = await sortMasjidData(snapshot, location)
          setMasjid(masjids1)
          setLoading(false)
        },
        (reason) => {
          setError(reason)
          console.log(reason)
        },
      )
  }

  return { masjid, loading, error, getLocation, GetDataRadMasjid }
}

function GetUsers(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    try {
      firestore()
        .collection("users")
        .get()
        .then((d) => {
          const data: User[] = []
          d.forEach((doc) => {
            data.push({ ...(doc.data() as User), uid: doc.id, id: doc.id })
          })
          resolve(data)
        })
    } catch (e) {
      reject(e)
    }
  })
}

export function useGetFavMasjidData() {
  const [loading, setLoading] = useState(true)
  const [masjid, setMasjid] = useState<Masjid[]>([])
  const [error, setError] = useState(null)
  const location = useAppSelector(selectCords)
  const favoriteId = useAppSelector(useFavorites)
  const subs = firestore().collection("Masjid")

  async function GetDataFavMasjid() {
    if (_.isNull(masjid)) {
      setLoading(true)
    }

    console.log("%c triggered the GetData from Faves", "color: #bada55")
    const favorites = favoriteId
    console.log(favorites, "<=========== favs from redux")
    if (_.isNull(favorites)) {
      console.log("No Favorites Found in the storage")
      setLoading(false)
      return
    }
    const collections: Promise<any>[] = []
    favorites.forEach((fav) => {
      if (!_.isNull(fav) && !_.isUndefined(fav)) {
        collections.push(subs.doc(fav).get())
        console.log(fav, "<======= faves from getFavData")
      }
    })
    try {
      const doc = await Promise.all(collections)
      const masjids: Masjid[] = []
      const users: User[] = await GetUsers()
      for (const docSnapshot of doc) {
        const data = docSnapshot.data()
        const loc1 = data.g.geopoint
        const d = haversine(loc1, location)
        const tempData = modifyData(data, docSnapshot.id, d)
        if (tempData.announcementList) {
          const announce = tempData.announcementList?.map(async (id: string) => getAnnouncement(id))
          tempData.announcements = await Promise.all(announce)
        }
        masjids.push(...sortMasjidDataHandle(tempData, users))
      }
      setMasjid(_.sortBy(masjids, "distance"))
      setLoading(false)
    } catch (e: any) {
      setError(e)
    }
  }

  return { masjid, loading, error, GetDataFavMasjid }
}

const getAnnouncement = async (id: string): Promise<Announcement> => {
  const data = await firestore().collection("announcement").doc(id).get()
  return { ...(data.data() as Announcement), id: data.id }
}

export function useGetMasjidPopulate({
  latitude,
  longitude,
}: {
  latitude?: number
  longitude?: number
}) {
  // const populates = [
  //   { child: "adminId", root: "users", childAlias: "user" }, // replace owner with user object
  // ]
  // useFirestoreConnect([
  //   {
  //     collection: "Masjid",
  //     populates,
  //   },
  // ])
  // const firestore = useAppSelector((state) => state.firestore)
  // const masjid = populate(firestore, "Masjid", populates)
  const location = useAppSelector(selectCords)
  const [user, setUser] = useState<User[]>([])
  const [masjid, setMasjid] = useState<Masjid[]>([])
  const masjidData = useMemo(
    () => sortMasjidData1(masjid, latitude && longitude ? { latitude, longitude } : location),
    [location, masjid],
  )

  React.useEffect(() => {
    const subscriber = firestore()
      .collection("Masjid")
      .onSnapshot(async (documentSnapshot) => {
        if (user.length === 0) {
          const users = await firestore().collection("users").get()
          setUser(users.docs.map((e) => e.data() as User))
        }
        setMasjid(
          documentSnapshot.docs.map((e) => ({
            ...(e.data() as Masjid),
            user: user[e.data()?.adminId],
            uid: e.id,
          })),
        )
      })
    return () => subscriber()
  }, [])

  return { masjid, masjidData, location }
}
