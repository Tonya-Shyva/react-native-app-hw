import { createSlice } from "@reduxjs/toolkit";
import { register, logIn, logOut, setAvatarAuth } from "./authOperations";

const initialState = {
  name: null,
  email: null,
  token: null,
  avatar: null,
  isAuth: false,
  id: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.id = action.payload.id;
        state.error = null;
        state.isAuth = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
      });
    builder
      .addCase(logIn.pending, (state) => {
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.id = action.payload.id;
        state.error = null;
        state.isAuth = true;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.error = action.payload;
      });
    builder
      .addCase(logOut.pending, (state) => {
        state.error = null;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.name = null;
        state.email = null;
        state.token = null;
        state.id = null;
        state.isAuth = false;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.error = action.payload;
      });
    builder
      .addCase(setAvatarAuth.pending, (state) => {
        state.error = null;
      })
      .addCase(setAvatarAuth.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.id = action.payload.id;
        state.avatar = action.payload.photoURL;
        state.error = null;
        state.isAuth = true;
      })
      .addCase(setAvatarAuth.rejected, (state, action) => {
        state.error = action.payload;
      });
  },

  reducers: {
    refreshUser: (state, action) => {
      // console.log(action.payload);
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.avatar = action.payload.photoURL;
      state.error = null;
      state.isAuth = true;
    },
  },
});

export const { refreshUser } = authSlice.actions;

export const authReducer = authSlice.reducer;
