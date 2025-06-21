import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './PlaceOrder.css';
import { useNavigate } from 'react-router-dom'; // ✅ Import

const PlaceOrder = () => {
  const { 
    getTotalCartAmount, 
    cartItems, 
    getCurrentRestaurantItems,
    token,
    url
  } = useContext(StoreContext);

  const navigate = useNavigate(); // ✅ Initialize navigate

  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", zipcode: "", country: "", phone: "", landmark: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const food_list = getCurrentRestaurantItems();
    const orderItems = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({
        ...item,
        quantity: cartItems[item._id]
      }));

    const orderData = {
      userId: localStorage.getItem('userId'),
      items: orderItems,
      amount: getTotalCartAmount() + (getTotalCartAmount() > 0 ? 40 : 0),
      address: data
    };

    try {
      const response = await axios.post(
        `${url}/api/order/place`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Order placed successfully! Thank you for choosing us.");
        const orderId = response.data.order._id; // ✅ Get order ID
        localStorage.setItem("lastOrderId", orderId);
        navigate("/order-success", { state: { orderId } }); // ✅ Pass state
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Error placing order. Please try again.");
    }
  };

  const deliveryFee = getTotalCartAmount() > 0 ? 40 : 0;

  return (
    <form onSubmit={handleSubmit} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' required />
          <input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' required />
        </div>
        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' required />
        <input name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' required />
        <div className="multi-fields">
          <input name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' required />
          <input name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' required />
        </div>
        <div className="multi-fields">
          <input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Pin code' required />
          <input name='landmark' onChange={onChangeHandler} value={data.landmark} type="text" placeholder='Landmark' />
        </div>
        <input name='phone' onChange={onChangeHandler} value={data.phone} type="tel" placeholder='Phone' required />
      </div>
      <div className="place-order-right">
        <div className="cart-summary">
          <div className="cart-totals">
            <h2>Order Summary</h2>
            <div className="totals-details">
              <div className="total-row"><span>Subtotal:</span><span>₹{getTotalCartAmount()}</span></div>
              <div className="total-row"><span>Delivery Fee:</span><span>₹{deliveryFee}</span></div>
              <div className="total-row grand-total"><span>Total:</span><span>₹{getTotalCartAmount() + deliveryFee}</span></div>
            </div>
            <button type="submit" className="checkout-button">Place Order (COD)</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
