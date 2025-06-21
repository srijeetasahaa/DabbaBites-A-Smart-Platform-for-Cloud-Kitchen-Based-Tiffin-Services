import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = ({ url }) => {
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [restaurantFilter, setRestaurantFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setList(response.data.data);
                setFilteredList(response.data.data);
            } else {
                toast.error("Failed to load food items");
            }
        } catch (error) {
            toast.error("Error fetching food list");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const removeFood = async (foodId) => {
        if (!window.confirm("Are you sure you want to delete this food item?")) return;
        
        try {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error deleting food item");
            console.error(error);
        }
    }

    useEffect(() => {
        fetchList();
    }, [url]);

    useEffect(() => {
        let filtered = list.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.restaurant && item.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (restaurantFilter) {
            filtered = filtered.filter(item => item.restaurant?._id === restaurantFilter);
        }

        setFilteredList(filtered);
    }, [searchTerm, restaurantFilter, list]);

    const uniqueRestaurants = [...new Set(
        list
            .map(item => item.restaurant?._id)
            .filter(id => id !== undefined)
    )].map(id => {
        return list.find(item => item.restaurant?._id === id)?.restaurant;
    });

    return (
        <div className='list add flex-col'>
            <h2>All Food Items</h2>
            
            <div className="list-filters">
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search food or restaurant..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="restaurant-filter">
                    <select
                        value={restaurantFilter}
                        onChange={(e) => setRestaurantFilter(e.target.value)}
                    >
                        <option value="">All Restaurants</option>
                        {uniqueRestaurants.map(restaurant => (
                            restaurant && (
                                <option key={restaurant._id} value={restaurant._id}>
                                    {restaurant.name}
                                </option>
                            )
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="list-table">
                    <div className="list-table-format title">
                        <b>Image</b>
                        <b>Name</b>
                        <b>Category</b>
                        <b>Price</b>
                        <b>Restaurant</b>
                        <b>Action</b>
                    </div>
                    
                    {filteredList.length === 0 ? (
                        <p className="no-results">No food items found</p>
                    ) : (
                        filteredList.map((item) => (
                            <div key={item._id} className='list-table-format'>
                                <img 
                                    src={`${url}/uploads/${item.image}`} 
                                    alt={item.name} 
                                    className="food-image"
                                />
                                <p>{item.name}</p>
                                <p>{item.category}</p>
                                <p>₹{item.price}</p>
                                <div 
                                    className="restaurant-cell"
                                    onClick={() => navigate(`/restaurant/${item.restaurant?._id}`)}
                                >
                                    {item.restaurant?.image && (
                                        <img 
                                            src={`${url}/uploads/${item.restaurant.image}`} 
                                            alt={item.restaurant.name} 
                                            className="restaurant-thumbnail"
                                        />
                                    )}
                                    <span className="restaurant-name">
                                        {item.restaurant?.name || 'N/A'}
                                    </span>
                                </div>
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
            )}
        </div>
    );
}

export default List;