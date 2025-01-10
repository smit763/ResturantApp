import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenuItems } from "../redux/slices/menuSlice";
import {
  addItemToOrder,
  fetchOrderDetail,
  removeItemFromOrder,
} from "../redux/slices/orderSlice";
import Button from "../components/Button";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../Axios/Axios";
import { toast } from "react-toastify";

const OrderBooking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tableId, reservationId } = useParams();
  const { menuItems } = useSelector((state) => state.menu);
  const { orderDetail, selectedItems, loading, error } = useSelector(
    (state) => state.order
  );

  const [quantities, setQuantities] = useState({});
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [errorOrder, setErrorOrder] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    dispatch(fetchMenuItems());

    const checkExistingOrder = async () => {
      if (reservationId) {
        dispatch(fetchOrderDetail(reservationId));
      }
    };

    if (reservationId) {
      checkExistingOrder();
    }
  }, [dispatch, reservationId]);

  const handleQuantityChange = (menuItemId, e) => {
    const updatedQuantities = { ...quantities, [menuItemId]: e.target.value };
    setQuantities(updatedQuantities);
  };

  const handleAddToOrder = (menuItemId) => {
    const quantity = parseInt(quantities[menuItemId] || 1);
    dispatch(addItemToOrder({ menuItemId, quantity }));
  };

  const handleRemoveFromOrder = (menuItemId) => {
    dispatch(removeItemFromOrder(menuItemId));
  };

  const handleSubmitOrder = async () => {
    setLoadingOrder(true);
    setErrorOrder("");

    const orderPayload = {
      tableId,
      reservationId,
      menuItems: selectedItems.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axiosClient.post("/add/order", orderPayload);
      toast.success("order added ");
      setLoadingOrder(false);
    } catch (error) {
      console.error("Error submitting order:", error);
      setErrorOrder("Failed to submit the order. Please try again.");
      setLoadingOrder(false);
    }
  };

  const calculateTotal = () => {
    console.log();

    return selectedItems.reduce((total, item) => {
      const menuItem = menuItems.find(
        (menuItem) => menuItem._id === item.menuItemId || item.menuItemId._id
      );
      return total + (menuItem?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCheckout = async () => {
    try {
      const orderPayload = {
        tableId,
        paymentMethod,
      };

      const response = await axiosClient.post(
        `/complete/order/${tableId}`,
        orderPayload
      );

      if (response.data.success) {
        console.log("Order completed successfully:", response.data);
        navigate(`/`);
      } else {
        console.log("Error completing the order:", response.data.message);
      }
    } catch (error) {
      console.log("API call failed:", error);
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 mt-24">
      <div>
        <h1 className="text-2xl text-center text-red-600 mb-6">
          Order Booking
        </h1>
        {loading ? (
          <div>Loading menu items...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-black text-white p-4 rounded-lg shadow-md hover:shadow-2xl transition duration-300"
              >
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p>{item.description}</p>
                <p className="text-sm text-gray-400">Price: ₹{item.price}</p>
                <div className="flex items-center mt-4 justify-between">
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={quantities[item._id] || 1}
                      onChange={(e) => handleQuantityChange(item._id, e)}
                      min="1"
                      className="w-16 p-2 text-black bg-white border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <Button
                    onClick={() => handleAddToOrder(item._id)}
                    className="ml-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Add to Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-red-600">Your Order:</h3>

        {orderDetail ? (
          <div>
            <div className="mt-6 bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-green-500">Bill Summary</h4>
              {selectedItems.map((item) => {
                const menuItem = menuItems.find(
                  (menuItem) =>
                    menuItem._id === item.menuItemId ||
                    menuItem._id === item.menuItemId._id
                );
                return (
                  <div
                    key={item.menuItemId}
                    className="flex justify-between items-center text-white mt-3"
                  >
                    <span>{menuItem?.name}</span>
                    <span>
                      ₹{menuItem?.price} x {item.quantity}
                    </span>
                    <span>₹{(menuItem?.price || 0) * item.quantity}</span>
                  </div>
                );
              })}
              <div className="mt-4 text-right text-white">
                <p className="text-xl font-bold">
                  Total: ₹{calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSubmitOrder}
              className="mt-6 bg-green-500 w-full py-2 rounded-lg text-white hover:bg-green-600"
            >
              Add Order
            </Button>

            <div className="mt-4">
              <h4 className="text-lg font-semibold">Payment Method</h4>
              <label>
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="mr-2"
                />
                Cash
              </label>
              <label className="ml-6">
                <input
                  type="radio"
                  value="credit"
                  checked={paymentMethod === "credit"}
                  onChange={() => setPaymentMethod("credit")}
                  className="mr-2"
                />
                Credit
              </label>
            </div>

            <Button
              onClick={handleCheckout}
              className="mt-4 bg-blue-500 w-full py-2 rounded-lg text-white hover:bg-blue-600"
            >
              Checkout
            </Button>
          </div>
        ) : (
          <div>
            {loadingOrder ? (
              <div className="text-center py-4">
                <p>Submitting your order...</p>
              </div>
            ) : (
              <Button
                onClick={handleSubmitOrder}
                className="mt-6 bg-green-500 w-full py-2 rounded-lg text-white hover:bg-green-600"
              >
                Add Order
              </Button>
            )}
          </div>
        )}

        {errorOrder && (
          <div className="mt-4 text-center text-red-500">{errorOrder}</div>
        )}
      </div>
    </div>
  );
};

export default OrderBooking;
