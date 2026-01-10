import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productsList: [],
  loading: false,
  error: null,
};
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.productsList.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.productsList.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.productsList[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.productsList = state.productsList.filter(
        (product) => product.id !== action.payload.id
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
  addProduct,
  updateProduct,
  deleteProduct,
  setLoading,
  setError,
} = productsSlice.actions;
export default productsSlice.reducer;
