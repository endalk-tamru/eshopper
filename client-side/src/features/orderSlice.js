import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,  
  errorMsg: null,
  orders: []
};

const BASE_URL = "/api/order/";

export const addToOrder = createAsyncThunk(
  "cart/addToOrder",
  async (product, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          ["x-auth-token"]: token,
        },
      };
      const res = await axios.post(BASE_URL, product, config);
      return res.data;
    } catch (err) {
      return thunkAPI.axiosrejectWithValue(err.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  extraReducers: {
    [addToOrder.pending]: (state) => {
      state.isLoading = true;      
    },
    [addToOrder.fulfilled]: (state, action) => {
      state.isLoading = false;      
      state.isSuccess = true;            
      state.orders = action.payload;
    },
    [addToOrder.rejected]: (state, action) => {
      state.isLoading = false;            
      state.isError = true;
      state.errorMsg = action.payload.errMsg;
    },
  },
});

export default orderSlice.reducer;
