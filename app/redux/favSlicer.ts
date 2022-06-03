import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import {RootState} from './store';

const initialState: {value: string[]} = {
  value: [],
};

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<string>) => {
      state.value.push(action.payload);
    },
    remove: (state, action: PayloadAction<string>) => {
      _.remove(state.value, function (c) {
        return c === action.payload;
      });
    },
  },
});

export const {add, remove} = favoriteSlice.actions;
export const useFavorites = (state: RootState) => state.favorites.value;
export default favoriteSlice.reducer;
