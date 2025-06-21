import React, { useState, useEffect } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from "axios";
import { toast } from 'react-toastify';

const Add = ({ url }) => {
    const [image, setImage] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        restaurantId: ""
    });

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(`${url}/api/restaurant/list`);
                if (response.data.success) {
                    setRestaurants(response.data.data);
                }
            } catch (error) {
                toast.error("Failed to load restaurants");
                console.error(error);
            }
        };
        fetchRestaurants();
    }, [url]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        if (!image) {
            toast.error("Please upload an image");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("restaurantId", data.restaurantId);
        formData.append("image", image);
        
        try {
            const response = await axios.post(`${url}/api/food/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Salad",
                    restaurantId: ""
                });
                setImage(false);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add food item");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img 
                            src={image ? URL.createObjectURL(image) : assets.upload_area} 
                            alt="Upload preview" 
                        />
                    </label>
                    <input 
                        onChange={(e) => setImage(e.target.files[0])} 
                        type="file" 
                        id='image' 
                        hidden 
                        required 
                        accept="image/*"
                    />
                </div>
                
                
                <div className="add-product-name flex-col">
                    <p>Product Name</p>
                    <input 
                        onChange={onChangeHandler} 
                        value={data.name} 
                        type="text" 
                        name='name' 
                        placeholder='Type food name' 
                        required
                    />
                </div>
                
                <div className="add-product-description flex-col">
                    <p>Product Description</p>
                    <textarea 
                        onChange={onChangeHandler} 
                        value={data.description} 
                        name="description" 
                        rows="6" 
                        placeholder='Write description here' 
                        required
                    ></textarea>
                </div>
                
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product Category</p>
                        <select 
                            onChange={onChangeHandler} 
                            value={data.category} 
                            name="category"
                            required
                        >
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Desserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                            <option value="Main Course">Main Course</option>
                            <option value="Sides">Sides</option>
                            <option value="Combo Meals">Combo Meals</option>


                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product Price (₹)</p>
                        <input 
                            onChange={onChangeHandler} 
                            value={data.price} 
                            type="number" 
                            name='price' 
                            placeholder='200' 
                            min="1"
                            required
                        />
                    </div>
                </div>
                
                <div className="add-restaurant flex-col">
                    <p>Select Restaurant</p>
                    <select 
                        onChange={onChangeHandler} 
                        value={data.restaurantId} 
                        name="restaurantId"
                        required
                    >
                        <option value="">Select a Restaurant</option>
                        {restaurants.map(restaurant => (
                            <option key={restaurant._id} value={restaurant._id}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <button 
                    type='submit' 
                    className='add-btn'
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Food Item'}
                </button>
            </form>
        </div>
    );
}

export default Add;