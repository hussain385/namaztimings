import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import favoriteReducer from './favSlicer';
import {
  getFirebase,
  actionTypes as rrfActionTypes,
  firebaseReducer,
} from 'react-redux-firebase';
import {firestoreReducer, constants as rfConstants} from 'redux-firestore';

const reducer = combineReducers({
  favorites: favoriteReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['favorites'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          ...Object.keys(rrfActionTypes).map(
            type => `@@reactReduxFirebase/${type}`,
          ),
          ...Object.keys(rfConstants.actionTypes).map(
            type => `${rfConstants.actionsPrefix}/${type}`,
          ),
        ],
        ignoredPaths: ['firebase', 'firestore'],
      },
      thunk: {extraArgument: {getFirebase}},
    }),
});
