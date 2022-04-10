import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  successMsg: null,
  errorMsg: null,
  cartQty: 0,
  cartInfo: {},
};

const BASE_URL = "/api/cart/";

export const fetchCarts = createAsyncThunk(
  "cart/fetchCarts",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          ["x-auth-token"]: token,
        },
      };
      const res = await axios.get(BASE_URL + id, config);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
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
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ id, cartId, qty, price },thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          ["x-auth-token"]: token,
        },
      };
      const res = await axios.put(`${BASE_URL}${id}/${cartId}`, { qty, price }, config);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.reponse.data);
    }
  }
);

export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async ({ id, cartId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          ["x-auth-token"]: token,
        },
      };
      const res = await axios.delete(`${BASE_URL}${id}/${cartId}`, config);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartMsg(state) {
      state.successMsg = null;
      state.errorMsg = null;
    },
    clearCartState(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.successMsg = null;
      state.errorMsg = null;
      state.cartQty = 0;
      state.cartInfo = {};
    },
  },
  extraReducers: {
    [addToCart.pending]: (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    },
    [addToCart.fulfilled]: (state, action) => {
      state.isLoading = false;      
      state.isSuccess = true;
      state.successMsg = action.payload.successMsg;
      state.cartQty = action.payload.cartInfo.products.length;
      state.cartInfo = action.payload.cartInfo;
    },
    [addToCart.rejected]: (state, action) => {
      state.isLoading = false;      
      state.successMsg = null;
      state.isError = true;
      state.errorMsg = action.payload.errMsg;
    },
    [fetchCarts.pending]: (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    },
    [fetchCarts.fulfilled]: (state, action) => {
      state.isLoading = false;      
      state.isSuccess = true;
      state.cartInfo = action.payload;
      state.cartQty = action.payload.products.length;
    },
    [fetchCarts.rejected]: (state, action) => {
      state.isLoading = false;      
      state.isError = true;
      state.errorMsg = action.payload;
    },
    [updateCart.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.cartInfo = action.payload;
      state.cartQty = action.payload.products.length;
    },
    [updateCart.rejected]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.errorMsg = action.payload.errMsg;
    },
    [deleteCart.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.cartInfo = action.payload;
      state.cartQty = action.payload.products.length;
    },
    [deleteCart.rejected]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.errorMsg = action.payload.errMsg;
    }
  },
});

export const { clearCartMsg, clearCartState } = cartSlice.actions;

export default cartSlice.reducer;
