import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image, restaurantId }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  const imageUrl = image.includes('http') ? image : `${url}/uploads/${image}`;

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img 
          className='food-item-image' 
          src={imageUrl} 
          alt={name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-food.jpg';
          }}
        />
        {!cartItems[id]
          ? <img 
              className='add' 
              onClick={() => addToCart(restaurantId, id)} 
              src={assets.add_icon_white} 
              alt="Add" 
            />
          : <div className='food-item-counter'>
              <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
              <p>{cartItems[id]}</p>
              <img onClick={() => addToCart(restaurantId, id)} src={assets.add_icon_green} alt="Add" />
            </div>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <div className="food-item-price">
          ₹{price}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;