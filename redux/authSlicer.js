import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// export const signIn = createAsyncThunk('signin',())

export const authSlicer = createSlice({
  name: 'auth',
  initialState: {},
  reducers: {
    signIn: (state, action, getFirebase) => {
      const firebase = getFirebase();
      const {email, password} = action.payload;
      firebase.login({
        email,
        password,
      });
    },
  },
});
