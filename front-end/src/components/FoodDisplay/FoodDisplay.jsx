import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import './FoodDisplay.css';

const FoodDisplay = ({ category, restaurantId, searchTerm = '' }) => {
  const { restaurantsWithMenu, loading } = useContext(StoreContext);

  if (loading) {
    return <div className="food-display-loading">Loading menu...</div>;
  }

  const currentRestaurant = restaurantId
    ? restaurantsWithMenu.find(r => r._id === restaurantId)
    : null;

  const allFoodItems = restaurantsWithMenu.flatMap(
    restaurant => restaurant.menuItems.map(item => ({
      ...item,
      restaurantId: restaurant._id.toString()
    }))
  );

  const foodItemsToDisplay = currentRestaurant
    ? currentRestaurant.menuItems.map(item => ({
        ...item,
        restaurantId: currentRestaurant._id.toString()
      }))
    : allFoodItems;

  const filteredItems = foodItemsToDisplay.filter(item =>
    (category === "All" || category === item.category) &&
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className='food-display' id='food-display'>
      <h2>{currentRestaurant ? `${currentRestaurant.name}'s Menu` : 'Top dishes near you'}</h2>
      <div className="food-display-list">
        {filteredItems.map((item, index) => (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            restaurantId={item.restaurantId}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
