import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./myOrder.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Orders Function
//   const fetchOrders = async () => {
//     const token = Cookies.get("token");
//     if (!token) {
//       setError("You need to log in to view your orders.");
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "http://localhost:4000/api/order/get-order",
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.success) {
//         setOrders(response.data.orders);
//         setError("");
//       } else {
//         setError(response.data.message || "Failed to fetch orders");
//       }
//     } catch (err) {
//       setError("Error fetching orders. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

// Fetch Orders Function
const fetchOrders = async (showLoader = true) => {
    const token = Cookies.get("token");
    if (!token) {
        setError("You need to log in to view your orders.");
        setLoading(false);
        return;
    }
    try {
        if (showLoader) setLoading(true);
        const response = await axios.post(
            "http://localhost:4000/api/order/get-order",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
            setOrders(response.data.orders);
            setError("");
        } else {
            setError(response.data.message || "Failed to fetch orders");
        }
    } catch (err) {
        setError("Error fetching orders. Please try again later.");
    } finally {
        if (showLoader) setLoading(false);
    }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to get CSS class based on status
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Processing":
        return "status-processing";
      case "Delivered":
        return "status-delivered";
      default:
        return "";
    }
  };

  return (
    <div className="my-orders">
      <h2>🛒 My Orders</h2>

      <button
        className="track-order-btn"
        onClick={(e) => {
          e.preventDefault();
          fetchOrders(false); // false = don't show loader when refreshing manually
        }}
      >
        Track Order 🔄
      </button>

      {loading ? (
        <p className="loading">⏳ Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="order-list">
          {orders.map((order, index) => (
            <div key={order.orderNumber} className="order-card">
              <div className="order-header">
                <p>
                  <strong>Order Number:{index + 1}</strong> {order.orderNumber}
                </p>
                <p className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </p>
              </div>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </p>
              <p
                className={`payment-status ${
                  order.payment ? "paid" : "not-paid"
                }`}
              >
                {order.payment ? "✅ Paid" : "❌ Pending"}
              </p>

              <div className="items-list">
                <h4>🛍️ Items:</h4>
                {order.items.map((item, index) => (
                  <p key={index}>
                    {item.name} - {item.quantity} x ₹{item.price}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
