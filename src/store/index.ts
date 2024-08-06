import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import productsReducer from "./products/ProductsSlice";

const Store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
