import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"

export interface User {
  email: string
  isAdmin?: boolean
  name: string
  phone: string
  id?: string
  uid?: string
}

export interface Masjid {
  address: string
  g: {
    geohash: string
    geopoint: FirebaseFirestoreTypes.GeoPoint
  }
  name: string
  timeStamp: FirebaseFirestoreTypes.Timestamp
  timing: MasjidTiming
  tokens: string[]
  gLink?: string
  pictureURL?: string
  requestList?: string[]
  user?: User
  adminId?: string
  distance?: number
  announcementList?: string[]
  announcements?: Announcement[]
  uid?: string
  donationInfo?: string
}

export interface Announcement {
  id?: string
  createdAt: FirebaseFirestoreTypes.Timestamp
  description: string
}

export interface MasjidTiming {
  asar: string
  eidUlAddah: string
  eidUlFitr: string
  fajar: string
  isha: string
  jummah: string
  magrib: string
  zohar: string
}
