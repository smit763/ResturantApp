import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../Axios/Axios";


export const fetchMenuItems = createAsyncThunk(
  "menu/fetchMenuItems",
  async () => {
    const response = await axiosClient.get("/all/menus");
    return response.data.data;
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menuItems: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default menuSlice.reducer;
