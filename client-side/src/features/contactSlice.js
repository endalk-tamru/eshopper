import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMsg: "",
  successMsg: "",
};

const BASE_URL = "/api/contact/";

export const sendMessage = createAsyncThunk(
  "user/sendMessage",
  async (msg, { rejectWithValue }) => {
    try {
      const res = await axios.post(BASE_URL, msg);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearContactState(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMsg = "";
      state.successMsg = ""
    },
  },
  extraReducers: {
    [sendMessage.pending]: (state) => {
      state.isLoading = true;
    },
    [sendMessage.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.successMsg = action.payload.successMsg;
    },
    [sendMessage.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMsg = action.payload.errMsg;
    },
  },
});

export const { clearContactState } = contactSlice.actions;
export default contactSlice.reducer;
