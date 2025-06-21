import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import './RestaurantMenu.css';

const RestaurantMenu = () => {
    const { restaurantId: id } = useParams();
    const navigate = useNavigate();
    const { url } = useContext(StoreContext);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}/api/restaurant/${id}`);
                
                if (response.data.success) {
                    setRestaurant(response.data.data);
                } else {
                    toast.error("Failed to load restaurant");
                }
            } catch (error) {
                toast.error("Error loading restaurant");
                console.error(error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, url, navigate]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!restaurant) {
        return <div className="error">Restaurant not found</div>;
    }

    return (
        <div className='restaurant-menu-container'>
            <div className="restaurant-header">
                <div className="restaurant-info">
                    <img 
                        src={`${url}/uploads/${restaurant.image}`} 
                        alt={restaurant.name} 
                        className="restaurant-logo"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-restaurant.jpg';
                        }}
                    />
                    <div className="restaurant-details">
                        <h2>{restaurant.name}</h2>
                        <p>📍 {restaurant.address}</p>
                        <p>📌 Pincode: {restaurant.pincode}</p>
                    </div>
                </div>
                
                <div className="menu-search">
                    <input 
                        type="text" 
                        placeholder="Search menu items..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="menu-categories">
                <h3>Menu</h3>
                <FoodDisplay 
                  category="All" 
                  restaurantId={id} 
                  searchTerm={searchTerm}
                />
            </div>
        </div>
    );
};

export default RestaurantMenu;
