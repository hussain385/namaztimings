import {configureStore} from '@reduxjs/toolkit';
import favoriteReducer from './favSlicer';

export const store = configureStore({
  reducer: {
    favorites: favoriteReducer,
  },
});
