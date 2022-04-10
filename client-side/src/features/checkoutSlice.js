import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMsg: null,
  url: null,
};

const BASE_URL = "/api/create-checkout-session/";

export const createCheckoutSession = createAsyncThunk(
  "stripe/createCheckoutSession",
  async ({ id, cartInfo }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          ["x-auth-token"]: token,
        },
      };
      const res = await axios.post(BASE_URL + id, cartInfo, config);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const checkoutSlice = createSlice({
  name: "payment",
  initialState,
  extraReducers: {
    [createCheckoutSession.pending]: (state) => {
      state.isLoading = true;
    },
    [createCheckoutSession.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.url = action.payload.url;
    },
    [createCheckoutSession.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMsg = action.payload.errMsg;
    },
  },
});

export default checkoutSlice.reducer;
