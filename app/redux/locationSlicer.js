import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {GeoCoordinates} from 'react-native-geolocation-service';
import _ from 'lodash';

// interface LocationState {
//   latitude: number,
//   longitude: number
// }

const initialState: GeoCoordinates = {
  latitude: 0,
  longitude: 0,
  accuracy: 0,
  altitude: undefined,
  altitudeAccuracy: undefined,
  heading: undefined,
  speed: undefined,
};

const locationSlice = createSlice({
  name: 'geolocation',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<GeoCoordinates>) => {
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
export const selectCords = state => state.location;

export default locationSlice.reducer;
