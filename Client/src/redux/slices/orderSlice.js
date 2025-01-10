import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../Axios/Axios"; // your axios instance

// Initial state for order detail
const initialState = {
  orderDetail: null,
  selectedItems: [], // Array to keep track of items added to the order
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

const calculateTotals = (selectedItems, menuItems) => {
  const totalQuantity = selectedItems?.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = selectedItems?.reduce((total, item) => {
    const menuItem = menuItems?.find(
      (menuItem) => menuItem._id === item.menuItemId
    );
    return total + (menuItem?.price || 0) * item.quantity;
  }, 0);

  return { totalQuantity, totalPrice };
};

export const fetchOrderDetail = createAsyncThunk(
  "order/fetchOrderDetail",
  async (reservationId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        `/get/single/order/${reservationId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderDetail = createAsyncThunk(
  "order/updateOrderDetail",
  async (orderPayload, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put("/update/order", orderPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addItemToOrder: (state, action) => {
      const { menuItemId, quantity } = action.payload;
      console.log(state.selectedItems);

      const existingItem = state.selectedItems.find(
        (item) => item.menuItemId === menuItemId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.selectedItems.push({ menuItemId, quantity });
      }

      const { totalQuantity, totalPrice } = calculateTotals(
        state.selectedItems,
        state.orderDetail?.menuItems || []
      );
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
    },

    removeItemFromOrder: (state, action) => {
      const menuItemId = action.payload;

      // Remove the item with the given menuItemId
      state.selectedItems = state.selectedItems.filter(
        (item) => item.menuItemId !== menuItemId
      );

      // Calculate totals after removing the item
      const { totalQuantity, totalPrice } = calculateTotals(
        state.selectedItems,
        state.orderDetail?.menuItems || []
      );
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
    },

    // Clear the order detail
    clearOrderDetail: (state) => {
      state.orderDetail = null;
      state.selectedItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload;
        state.selectedItems =
          action?.payload.data?.[0]?.menuItems.map((res) => ({
            ...res,
            ...res.menuItemId,
          })) || [];
        state.error = null;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload; // Update with the new order detail
        state.error = null;
      })
      .addCase(updateOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addItemToOrder, removeItemFromOrder, clearOrderDetail } =
  orderSlice.actions;

export default orderSlice.reducer;
