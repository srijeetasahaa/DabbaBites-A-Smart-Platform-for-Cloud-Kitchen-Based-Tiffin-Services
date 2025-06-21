import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/order/all");
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put("http://localhost:4000/api/order/status", {
        orderId,
        status: newStatus,
      });
      fetchOrders(); // refresh list
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2>All Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <h3>Order ID: {order._id}</h3>
            <p><strong>User ID:</strong> {order.userId}</p>
            <p className={order.payment ? "order-paid" : "order-unpaid"}>
              <strong>Payment:</strong> {order.payment ? "Paid" : "COD"}
            </p>
            <p><strong>Total:</strong> ₹{order.amount}</p>
            <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>

            <p><strong>Address:</strong> {order.address?.street}, {order.address?.city}</p>

            <div>
              <strong>Status:</strong>{" "}
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
              >
                <option value="Order Received">Order Received</option>
                <option value="Processing">Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <h4>Items:</h4>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>{item.name} × {item.quantity}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
