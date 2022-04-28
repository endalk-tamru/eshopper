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

export const fetchUserOrders = createAsyncThunk(
  "cart/fetchUserOrders",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          ["x-auth-token"]: token,
        },
      };
      const res = await axios.get(BASE_URL + "/history/" + id, config);
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
    [fetchUserOrders.pending]: (state) => {
      state.isLoading = true;      
    },
    [fetchUserOrders.fulfilled]: (state, action) => {
      state.isLoading = false;      
      state.isSuccess = true;            
      state.orders = action.payload;
    },
    [fetchUserOrders.rejected]: (state, action) => {
      state.isLoading = false;            
      state.isError = true;
      state.errorMsg = action.payload.errMsg;
    }    
  },
});

export default orderSlice.reducer;
