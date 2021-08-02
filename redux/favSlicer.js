import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

const fetchFav = createAsyncThunk('fav/asyncStorage', async () => {
  const response = await AsyncStorage.getItem('favorites');
  console.log(
    response,
    'getting respaunce from data in redux',
    typeof response,
    JSON.parse(response),
  );
  return JSON.parse(response);
});

const initialState = {
  value: [],
};

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    add: (state, action) => {
      state.value.push(action.payload);
      AsyncStorage.setItem('favorites', JSON.stringify(state));
    },
    remove: (state, action) => {
      _.remove(state, function (c) {
        return c === action.payload;
      });
    },
    set: (state, action) => {
      state.value = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchFav.fulfilled, (state, action) => {
      state.value.push(action.payload);
    });
  },
  // middleware: (getDefaultNeddkeware) {

  // }
});

export const {add, remove, set} = favoriteSlice.actions;

export default favoriteSlice.reducer;
