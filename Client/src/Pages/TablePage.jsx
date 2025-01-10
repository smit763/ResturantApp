import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Icons for availability
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchTables } from "../redux/slices/tableSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TablePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { tables, loading, error } = useSelector((state) => state.tables);

  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  const getStatusClass = (reservationCount) => {
    return reservationCount === 0 ? "bg-green-500" : "bg-red-500";
  };

  const handleTableClick = (tableId) => {
    navigate(`/reserve-table/${tableId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl text-center text-red-600 mb-8 font-extrabold">
        Table Reservations
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {tables.map((table, index) => (
          <div
            key={index}
            className={`flex flex-col items-center p-6 bg-black text-white border-2 border-gray-700 rounded-xl shadow-lg transition-transform transform ${getStatusClass(
              table.reservationCount
            )}`}
          >
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold">{`Table ${table.tableNumber}`}</h2>
              <p className="mt-2 text-xl font-medium">
                {table.reservationCount === 0 ? (
                  <span className="flex items-center justify-center text-white">
                    <FaCheckCircle className="mr-2" />
                    Available
                  </span>
                ) : (
                  <span className="flex items-center justify-center text-white">
                    <FaTimesCircle className="mr-2" />
                    Occupied
                  </span>
                )}
              </p>
            </div>

            <div className="w-full mt-4 text-left space-y-4">
              <p className="text-lg text-gray-200">
                {table.reservationCount} reservation
                {table.reservationCount !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={() => handleTableClick(table._id)}
              className={`mt-4 px-6 py-3 border-2 border-white text-white font-bold rounded-lg bg-transparent hover:bg-white ${
                table.reservationCount === 0 ? "hover:text-green-500" : "hover:text-red-500"
              } transition duration-300`}
            >
              Reserve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablePage;
