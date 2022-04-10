import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMsg: null,
  products: [],
  categoryStats: [],
  productDetail: {},
  hasNextPage: 0,
};

const BASE_URL = "/api/product/";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    { pageNum = 1, category = "", search = "", filterString = "" },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${BASE_URL}?inStock=${true}&pageNum=${pageNum}&category=${category}&search=${search}&${filterString}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const checkNextPage = createAsyncThunk(
  "products/nextPage",
  async ({ pageNum = 1, category = "", search = "", filterString = "" }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}?inStock=${true}&pageNum=${pageNum}&category=${category}&search=${search}&${filterString}`
      );
      return res.data.length;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL + id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const numOfProductByCategory = createAsyncThunk(
  "products/categoryStat",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL + "category-stats");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  extraReducers: {
    [fetchProducts.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchProducts.fulfilled]: (state, action) => {      
      state.isLoading = false;
      state.isSuccess = true;
      state.products = action.payload;
    },
    [fetchProducts.rejected]: (state, action) => {
      state.isError = true;
      state.errorMsg = action.payload;
    },
    [checkNextPage.pending]: (state) => {
      state.isLoading = true;
    },
    [checkNextPage.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.hasNextPage = action.payload;
    },
    [checkNextPage.rejected]: (state, action) => {
      state.isError = true;
      state.errorMsg = action.payload;
    },
    [fetchProductById.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchProductById.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.productDetail = action.payload;
    },
    [fetchProductById.rejected]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.errorMsg = action.payload.msg;
    },
    [numOfProductByCategory.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.categoryStats = action.payload;
    }
  },
});

export default productSlice.reducer;

// export const selectAllProducts = (state) => state.products;

// export const selectProductById = (state, id) =>
//   state.products.products.find((product) => product._id === id);
