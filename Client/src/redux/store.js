import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "./slices/tableSlice";
import reservationReducer from "./slices/reserveSlice";
import menuReducer from "./slices/menuSlice";
import orderReducer from "./slices/orderSlice";

const store = configureStore({
  reducer: {
    tables: tableReducer,
    reservation: reservationReducer,
    menu: menuReducer,
    order: orderReducer,
  },
});

export default store;
