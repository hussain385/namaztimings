import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

const initialState = {
  value: [],
};

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    add: (state, action) => {
      state.value.push(action.payload);
    },
    remove: (state, action) => {
      _.remove(state.value, function (c) {
        return c === action.payload;
      });
    },
  },
});

export const {add, remove, set} = favoriteSlice.actions;

export default favoriteSlice.reducer;
