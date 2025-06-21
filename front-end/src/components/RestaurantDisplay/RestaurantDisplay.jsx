import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category, restaurantId }) => {
  const { restaurantsWithMenu, loading } = useContext(StoreContext);

  if (loading) {
    return <div className="food-display-loading">Loading menu...</div>;
  }

  // Get the specific restaurant's menu if restaurantId is provided
  const currentRestaurant = restaurantId 
    ? restaurantsWithMenu.find(r => r._id === restaurantId)
    : null;

  // Get all food items from all restaurants if no restaurantId
  const allFoodItems = restaurantsWithMenu.flatMap(
    restaurant => restaurant.menuItems.map(item => ({
      ...item,
      restaurantId: restaurant._id
    }))
  );

  const foodItemsToDisplay = currentRestaurant 
    ? currentRestaurant.menuItems
    : allFoodItems;

  return (
    <div className='food-display' id='food-display'>
      <h2>{currentRestaurant ? `${currentRestaurant.name}'s Menu` : 'Top dishes near you'}</h2>
      <div className="food-display-list">
        {foodItemsToDisplay
          .filter(item => category === "All" || category === item.category)
          .map((item, index) => (
            <FoodItem 
              key={index} 
              id={item._id} 
              name={item.name} 
              description={item.description} 
              price={item.price} 
              image={item.image}
              restaurantId={item.restaurant || item.restaurantId}
            />
          ))
        }
      </div>
    </div>
  )
}

export default FoodDisplay