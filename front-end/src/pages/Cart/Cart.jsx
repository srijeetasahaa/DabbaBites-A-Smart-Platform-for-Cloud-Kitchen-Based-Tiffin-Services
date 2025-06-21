import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems = {},
    restaurantsWithMenu = [],
    selectedRestaurant,
    removeFromCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const deliveryFee = getTotalCartAmount() > 0 ? 40 : 0;

  const currentRestaurant = restaurantsWithMenu.find(
    (r) => r._id === selectedRestaurant
  );

  const menuItems = currentRestaurant?.menuItems || [];

  const cartItemList = menuItems.filter(
    (item) => item?._id && cartItems[item._id] > 0
  );

  return (
    <div className="cart">
      {currentRestaurant ? (
        <div className="cart-restaurant">
          <h3>Ordering from: {currentRestaurant.name}</h3>
          <p>{currentRestaurant.address}</p>
        </div>
      ) : (
        <div className="no-restaurant">
         
        </div>
      )}

      <div className="cart-items">
        {cartItemList.length === 0 ? (
          <div className="empty-cart">
            <h3>Your cart is empty</h3>
            <button
              onClick={() => navigate("/")}
              className="browse-button"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-title">
              <p>Item</p>
              <p>Name</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>

            {cartItemList.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-details">
                  <img
                    src={item.image ? `${url}/uploads/${item.image}` : "/default-food.jpg"}
                    alt={item.name || "Food item"}
                    className="cart-item-image"
                  />
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">₹{item.price}</p>
                  <p className="item-quantity">{cartItems[item._id]}</p>
                  <p className="item-total">
                    ₹{item.price * cartItems[item._id]}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="remove-button"
                  >
                    ×
                  </button>
                </div>
                <hr className="item-divider" />
              </div>
            ))}
          </>
        )}
      </div>

      {cartItemList.length > 0 && (
        <div className="cart-summary">
          <div className="cart-totals">
            <h2>Order Summary</h2>
            <div className="totals-details">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{getTotalCartAmount()}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee:</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>₹{getTotalCartAmount() + deliveryFee}</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/order")}
              className="checkout-button"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
