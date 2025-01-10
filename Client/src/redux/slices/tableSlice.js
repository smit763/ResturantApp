import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../Axios/Axios';

export const fetchTables = createAsyncThunk('tables/fetchTables', async () => {
  try {
    const response = await axiosClient.get("/all/tables");
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch tables");
    }
  } catch (error) {
    throw error;
  }
});

const tableSlice = createSlice({
  name: 'tables',
  initialState: {
    tables: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default tableSlice.reducer;
