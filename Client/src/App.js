import React from "react";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import TablePage from "./Pages/TablePage";
import OrderBooking from "./Pages/OrderBooking";
import ReserveTable from "./Pages/ReserveTable";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<TablePage />} />
          <Route
            path="/order-booking/:tableId/:reservationId"
            element={<OrderBooking />}
          />
          <Route path="/reserve-table/:id" element={<ReserveTable />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
