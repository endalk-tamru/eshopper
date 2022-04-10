import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import productReducer from "../features/productSlice";
import reviewReducer from "../features/reviewSlice";
import cartReducer from "../features/cartSlice";
import checkoutReducer from "../features/checkoutSlice";
import contactReducer from "../features/contactSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    review: reviewReducer,
    carts: cartReducer,
    checkout: checkoutReducer,
    contact: contactReducer
  },  
});
