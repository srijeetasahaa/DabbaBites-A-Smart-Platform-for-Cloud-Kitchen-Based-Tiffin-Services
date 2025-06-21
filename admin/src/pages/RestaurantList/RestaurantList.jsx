import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RestaurantList.css';
import { toast } from 'react-toastify';

const RestaurantList = ({ url }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${url}/api/restaurant/list`);
      if (response.data.success) {
        setRestaurants(response.data.data);
      } else {
        toast.error("Failed to fetch restaurants");
      }
    } catch (error) {
      toast.error("Error fetching restaurants");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;
    try {
      const response = await axios.post(`${url}/api/restaurant/remove`, { id });
      if (response.data.success) {
        toast.success("Restaurant deleted");
        setRestaurants(prev => prev.filter(r => r._id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting restaurant");
      console.error(error);
    }
  };

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.address.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="restaurant-list">
      <h2 className="restaurant-title">Restaurant List</h2>

      <div className="restaurant-search">
        <input
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="restaurant-grid">
        {filteredRestaurants.map(restaurant => (
          <div key={restaurant._id} className="restaurant-card">
            <img src={`${url}/uploads/${restaurant.image}`} alt={restaurant.name} />
            <h3>{restaurant.name}</h3>
            <p className="address">{restaurant.address}</p>
            <p>📍 Pin: {restaurant.pincode}</p>
            <p>📞 {restaurant.phone}</p>
            <button onClick={() => handleDelete(restaurant._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
