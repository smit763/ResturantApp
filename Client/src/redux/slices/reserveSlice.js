import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../Axios/Axios";

export const fetchReservationsByTable = createAsyncThunk(
  "reservation/fetchReservationsByTable",
  async (tableId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/table/reservation/${tableId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reservations"
      );
    }
  }
);

export const reserveTable = createAsyncThunk(
  "reservation/reserveTable",
  async (reservationData) => {
    try {
      const response = await axiosClient.post(
        `/reserve/table/${reservationData.tableId}`,
        reservationData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  }
);

const reserveSlice = createSlice({
  name: "reservation",
  initialState: {
    loading: false,
    success: null,
    error: null,
    reservations: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(reserveTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reserveTable.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(reserveTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to make reservation";
      })
      .addCase(fetchReservationsByTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservationsByTable.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchReservationsByTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch reservations";
      });
  },
});

export default reserveSlice.reducer;
