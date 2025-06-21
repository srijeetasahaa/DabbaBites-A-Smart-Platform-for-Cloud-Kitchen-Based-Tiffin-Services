import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderId = location.state?.orderId || localStorage.getItem("lastOrderId");

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("❌ No orderId passed in state.");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:4000/api/order/${orderId}`);
        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          setError("❌ Order not found.");
        }
      } catch (err) {
        console.error("❌ Error fetching order:", err);
        setError("Error loading order.");
      }
    };

    fetchOrder();
  }, [orderId]);

  if (error) return <div className="order-error">{error}</div>;

  if (!order) return <div className="order-loading">Loading your order details...</div>;

  return (
    <div className="order-success">
      <h1>🎉 Order Placed Successfully!</h1>
      <p>Order ID: <strong>{order._id}</strong></p>
      <p>Status: {order.status}</p>
      <p>Total: ₹{order.amount}</p>
      <div className="eco-image-section">
  <img src={assets.eco_delivery} alt="Eco Delivery" className="eco-image" />
</div>
      <p>
        Delivery Address: {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipcode}
      </p>

      <p className="eco-delivery">
        🌱 This order qualifies for <strong>Eco Delivery</strong> — fewer plastics, more green!
      </p>

      {order.status === "Out for Delivery" && (
        <button
          onClick={() => navigate(`/track/${order._id}`)}
          className="track-order-button"
        >
          🚴 Track Your Order
        </button>
      )}
    </div>
  );
};

export default OrderSuccess;
