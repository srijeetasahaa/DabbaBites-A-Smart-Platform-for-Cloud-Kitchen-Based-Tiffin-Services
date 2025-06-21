import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import './List.css';

const RestaurantMenu = ({ url }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [menuResponse, restaurantResponse] = await Promise.all([
                    axios.get(`${url}/api/food/menu/${id}`),
                    axios.get(`${url}/api/restaurant/${id}`)
                ]);

                if (menuResponse.data.success && restaurantResponse.data.success) {
                    setMenu(menuResponse.data.data);
                    setRestaurant(restaurantResponse.data.data);
                } else {
                    toast.error("Failed to load restaurant data");
                }
            } catch (error) {
                toast.error("Error loading restaurant menu");
                console.error(error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, url, navigate]);

    const removeFood = async (foodId) => {
        if (!window.confirm("Are you sure you want to remove this menu item?")) return;
        
        try {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
            if (response.data.success) {
                toast.success(response.data.message);
                setMenu(prev => prev.filter(item => item._id !== foodId));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error deleting menu item");
            console.error(error);
        }
    };

    const filteredMenu = menu.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!restaurant) {
        return <div className="error">Restaurant not found</div>;
    }

    return (
        <div className='list add flex-col'>
            <div className="restaurant-header">
                <div className="restaurant-info">
                    <img 
                        src={`${url}/uploads/${restaurant.image}`} 
                        alt={restaurant.name} 
                        className="restaurant-logo"
                    />
                    <div>
                        <h2>{restaurant.name}</h2>
                        <p>📍 {restaurant.address} (Pincode: {restaurant.pincode})</p>
                        <p>📞 {restaurant.phone}</p>
                    </div>
                </div>
                
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search menu items..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                
                {filteredMenu.length === 0 ? (
                    <p className="no-results">No menu items found</p>
                ) : (
                    filteredMenu.map((item) => (
                        <div key={item._id} className='list-table-format'>
                            <img 
                                src={`${url}/uploads/${item.image}`} 
                                alt={item.name} 
                                className="food-image"
                            />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>₹{item.price}</p>
                            <p 
                                onClick={() => removeFood(item._id)} 
                                className='cursor delete-btn'
                            >
                                🗑️
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RestaurantMenu;