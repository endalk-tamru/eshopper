import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMsg: null,
  reviewQty: 0,
  reviewInfo: [],
  review: {}
};

const BASE_URL = "/api/review/";

export const fetchReviews = createAsyncThunk(
  "products/fetchReviews",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(BASE_URL);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const fetchReviewById = createAsyncThunk(
  "review/fetchReviewById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL + id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addReview = createAsyncThunk(
  "review/addReview",
  async ({ id, username, rate, comment }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          ["x-auth-token"]: token,
        },
      };
      const res = await axios.post(BASE_URL + id, { username, rate, comment }, config);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "cart/deleteReview",
  async ({ id, productId, reviewId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          ["x-auth-token"]: token,
        },
      };
      const res = await axios.delete(`${BASE_URL}${id}/${productId}/${reviewId}`, config);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  extraReducers: {
    [fetchReviews.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchReviews.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.reviewInfo = action.payload;
    },
    [fetchReviews.rejected]: (state, action) => {
      state.isError = true;
      state.errorMsg = action.payload;
    },
    [fetchReviewById.pending]: (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    },
    [fetchReviewById.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.review = action.payload;
      state.reviewQty = action.payload.reviews.length;
    },
    [fetchReviewById.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errMsg = action.payload.errMsg;
    },
    [addReview.pending]: (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    },
    [addReview.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.review = action.payload;
      state.reviewQty = action.payload.reviews.length;
    },
    [addReview.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMsg = action.payload.errMsg;
    },
    [deleteReview.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.review = action.payload;
      state.reviewQty = action.payload.reviews.length;
    },
    [deleteReview.rejected]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.errorMsg = action.payload.errMsg;
    },
  },
});

export default reviewSlice.reducer;
