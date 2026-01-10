import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customerList: [],
    loading: false,
    error: null,
  },
  reducers: {
    addCustomer: (state, action) => {
      state.customerList.push(action.payload);
    },
    updateCustomer: (state, action) => {
      const index = state.customerList.findIndex(
        (customer) => customer.id === action.payload.id
      );
      if (index !== -1) {
        state.customerList[index] = action.payload;
      }
    },
    deleteCustomer: (state, action) => {
      state.customerList = state.customerList.filter(
        (customer) => customer.id !== action.payload.id
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
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setLoading,
  setError,
} = customerSlice.actions;
export default customerSlice.reducer;
