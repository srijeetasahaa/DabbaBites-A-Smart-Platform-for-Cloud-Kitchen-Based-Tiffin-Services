import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext'; // adjust path if needed
import './OrderHistory.css'; // optional

const OrderHistory = () => {
  const { token, url } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`${url}/api/order/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          alert('Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
        alert('Error fetching user orders');
      }
    };

    fetchUserOrders();
  }, [token, url]);

  return (
    <div className="order-history">
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div className="order-card" key={order._id}>
            <p><strong>Order ID:</strong> {order._id}</p>
            
            <p><strong>Total:</strong> ₹{order.amount}</p>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>{item.name} × {item.quantity}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
