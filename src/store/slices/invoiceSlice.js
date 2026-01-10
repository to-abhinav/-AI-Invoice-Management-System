import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoiceList: [],
  loading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    addInvoice: (state, action) => {
      state.invoiceList.push(action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.invoiceList.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (index !== -1) {
        state.invoiceList[index] = action.payload;
      }
    },
    deleteInvoice: (state, action) => {
      state.invoiceList = state.invoiceList.filter(
        (invoice) => invoice.id !== action.payload.id
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addInvoice,
  updateInvoice,
  deleteInvoice,
  setLoading,
  setError,
} = invoiceSlice.actions;
export default invoiceSlice.reducer;
