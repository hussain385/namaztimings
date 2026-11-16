import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist"
import favoriteReducer from "./favSlicer"
import locationSlicer from "./locationSlicer"
import { actionTypes as rrfActionTypes, firebaseReducer, getFirebase } from "react-redux-firebase"
import { constants as rfConstants, firestoreReducer } from "redux-firestore"
import { MMKV } from "react-native-mmkv"
import announcementSlicer from "./announcementSlicer"

export const storage = new MMKV()

export const reduxStorage = {
  setItem: (key: string, value: string | number | boolean) => {
    storage.set(key, value)
    return Promise.resolve(true)
  },
  getItem: (key: string) => {
    const value = storage.getString(key)
    return Promise.resolve(value)
  },
  removeItem: (key: string) => {
    storage.delete(key)
    return Promise.resolve()
  },
}
const reducer = combineReducers({
  favorites: favoriteReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  location: locationSlicer,
  announcement: announcementSlicer,
})

const persistConfig = {
  key: "root",
  storage: reduxStorage,
  whitelist: ["favorites", "location", "announcement"],
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          ...Object.keys(rrfActionTypes).map((type) => `@@reactReduxFirebase/${type}`),
          ...Object.keys(rfConstants.actionTypes).map(
            (type) => `${rfConstants.actionsPrefix}/${type}`,
          ),
        ],
        ignoredPaths: ["firebase", "firestore"],
      },
      thunk: { extraArgument: { getFirebase } },
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
