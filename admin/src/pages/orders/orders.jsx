import React, { useEffect, useState } from "react";
import "./order.css"; // Ensure styles exist
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the backend API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/order"); // Backend API URL
        console.log(response.data); // Debugging
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setOrders(response.data);
        } else {
          console.error("No orders found");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/order/update-status/${orderId}`, { status: newStatus });

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="orders-page">
      <h2 className="orders-header">Your Orders</h2>
      <div className="orders-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order ID: {order._id}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="order-customer-info">
                <p><strong>Customer:</strong> {order.firstName} {order.lastName}</p>
                <p><strong>Address:</strong> {order.street}, {order.city}, {order.state}, {order.country} - {order.pincode}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
              </div>
              <div className="order-items">
                <h3>Items:</h3>
                {order.items.map((item) => (
                  <div key={item._id} className="order-item">
                    <p><strong>{item.name}</strong></p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {item.price}₹</p>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <p className="order-total">Total: {order.totalAmount}₹</p>

                {/* Status Dropdown */}
                <label htmlFor={`status-${order._id}`}>Status: </label>
                <select
                  id={`status-${order._id}`}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                </select>

                <p className={`payment-status ${order.paymentStatus ? "paid" : "not-paid"}`}>
                  Payment: {order.payment ? "✅ Paid" : "❌ Not Paid"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
