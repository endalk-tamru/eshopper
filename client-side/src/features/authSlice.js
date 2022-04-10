import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMsg: "",
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("userInfo")) || null,
};

const BASE_URL = "/api/auth/";

export const userRegister = createAsyncThunk(
  "user/userRegister",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(BASE_URL + "register", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(BASE_URL + "login", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await localStorage.removeItem("token");
  await localStorage.removeItem("userInfo");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMsg = "";
    },
  },
  extraReducers: {
    [userRegister.pending]: (state) => {
      state.isLoading = true;
    },
    [userRegister.fulfilled]: (state, action) => {
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      state.isLoading = false;
      state.isSuccess = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    [userRegister.rejected]: (state, action) => {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      state.isLoading = false;
      state.token = null;
      state.user = null;
      state.isError = true;
      state.errorMsg = action.payload.errMsg;
    },
    [userLogin.pending]: (state) => {
      state.isLoading = true;
    },
    [userLogin.fulfilled]: (state, action) => {
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      state.isLoading = false;
      state.isSuccess = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    [userLogin.rejected]: (state, action) => {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      state.isLoading = false;
      state.token = null;
      state.user = null;
      state.isError = true;
      state.errorMsg = action.payload.errMsg;
    },
    [logout.fulfilled]: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
