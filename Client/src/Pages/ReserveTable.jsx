import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  reserveTable,
  fetchReservationsByTable,
} from "../redux/slices/reserveSlice";
import { useNavigate, useParams } from "react-router-dom";

const ReserveTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error, reservations } = useSelector(
    (state) => state.reservation
  );

  const { id } = useParams();

  const [showModal, setShowModal] = useState(false);
  const currentDateTime = new Date().toISOString().slice(0, 16);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleOrderClick = (reservationId) => {
    navigate(`/order-booking/${id}/${reservationId}`);
  };

  const onSubmit = (data) => {
    const reservationData = {
      startTime: data.startTime,
      endTime: data.endTime,
      customerName: data.customerName,
      tableId: id,
    };
    dispatch(reserveTable(reservationData))
      .then((res) => {
        console.log(res);

        if (res?.payload?.success) {
          toast.success(res.payload.message);
          reset();
          dispatch(fetchReservationsByTable(id));
          handleModalClose();
        } else {
          toast.warn(res.error.message);
        }
      })
      .catch((err) => {
        console.log(err);

        toast.error("Something went wrong");
      });
  };

  const startTime = watch("startTime");

  useEffect(() => {
    dispatch(fetchReservationsByTable(id));
  }, []);

  useEffect(() => {
    const closeModalOnEsc = (e) => {
      if (e.key === "Escape") {
        handleModalClose();
      }
    };

    const closeModalOnClickOutside = (e) => {
      if (e.target.id === "modal-background") {
        handleModalClose();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", closeModalOnEsc);
      document.addEventListener("mousedown", closeModalOnClickOutside);
    } else {
      document.removeEventListener("keydown", closeModalOnEsc);
      document.removeEventListener("mousedown", closeModalOnClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", closeModalOnEsc);
      document.removeEventListener("mousedown", closeModalOnClickOutside);
    };
  }, [showModal]);

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-4xl text-center text-red-600 font-extrabold mb-6">
        Reserve Your Table
      </h1>

      <button
        onClick={handleModalOpen}
        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-md hover:shadow-xl"
      >
        Add Reservation
      </button>

      <div className="mt-8 w-full max-w-7xl mx-auto">
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          Existing Reservations
        </h2>
        {reservations?.data?.length === 0 ? (
          <p className="text-white text-center">
            No reservations for this table.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations?.data?.map((reservation, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-white text-lg font-semibold">
                    <p>
                      <strong>Customer:</strong> {reservation.customerName}
                    </p>
                  </div>
                  <button
                    className="ml-auto bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                    onClick={() => handleOrderClick(reservation._id)}
                  >
                    Order
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(reservation.startTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {new Date(reservation.endTime).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div
          id="modal-background"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all duration-500 opacity-1"
          style={{ animation: "fadeIn 0.5s forwards" }}
        >
          <div
            className="bg-black text-white p-8 rounded-xl w-full max-w-md animate__animated animate__fadeIn animate__faster"
            style={{ animation: "slideIn 0.5s ease-out forwards" }}
          >
            <h2 className="text-xl text-center font-semibold mb-4">
              Add Reservation
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="customerName" className="text-lg font-medium">
                  Your Name
                </label>
                <input
                  {...register("customerName", {
                    required: "Name is required",
                  })}
                  type="text"
                  className="w-full p-4 border-2 border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Enter your name"
                />
                {errors.customerName && (
                  <span className="text-red-500 text-sm">
                    {errors.customerName.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="startTime" className="text-lg font-medium">
                  Start Time
                </label>
                <input
                  {...register("startTime", {
                    required: "Start time is required",
                    validate: (value) =>
                      value >= currentDateTime ||
                      "Start time cannot be in the past",
                  })}
                  type="datetime-local"
                  className="w-full p-4 border-2 border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  min={currentDateTime}
                />
                {errors.startTime && (
                  <span className="text-red-500 text-sm">
                    {errors.startTime.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="endTime" className="text-lg font-medium">
                  End Time
                </label>
                <input
                  {...register("endTime", {
                    required: "End time is required",
                    validate: (value) =>
                      value > startTime || "End time must be after start time",
                  })}
                  type="datetime-local"
                  className="w-full p-4 border-2 border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  min={startTime}
                />
                {errors.endTime && (
                  <span className="text-red-500 text-sm">
                    {errors.endTime.message}
                  </span>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                  disabled={loading}
                >
                  {loading ? "Reserving..." : "Reserve Table"}
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReserveTable;
