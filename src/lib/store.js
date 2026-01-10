"use client";
import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from "../store/slices/invoiceSlice";
import productReducer from "../store/slices/productsSlice";
import customerReducer from "../store/slices/customerSlice";

export const store = configureStore({
  reducer: {
    invoices: invoiceReducer,
    products: productReducer,
    customers: customerReducer,
  },
});
