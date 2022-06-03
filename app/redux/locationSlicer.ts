import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import {LocationObjectCoords} from 'expo-location';
import {RootState} from './store';

const initialState: LocationObjectCoords = {
  latitude: 0,
  longitude: 0,
  altitude: null,
  heading: null,
  speed: null,
  accuracy: null,
  altitudeAccuracy: null,
};

const locationSlice = createSlice({
  name: 'geolocation',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<LocationObjectCoords>) => {
      if (!_.isNull(action.payload)) {
        state = action.payload;
      }
      // console.log(state, action.payload)
      return state;
    },
  },
});

export const {setLocation} = locationSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectCords = (state: RootState) => state.location;

export default locationSlice.reducer;
