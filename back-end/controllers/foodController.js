import { Food, Restaurant } from '../models/index.js';
import fs from 'fs';

export const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const { name, description, price, category, restaurantId } = req.body;
        
        if (!name || !description || !price || !category || !restaurantId) {
            fs.unlink(`uploads/${req.file.filename}`, () => {});
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            fs.unlink(`uploads/${req.file.filename}`, () => {});
            return res.status(404).json({ 
                success: false, 
                message: "Restaurant not found" 
            });
        }

        const food = new Food({
            name,
            description,
            price,
            category,
            image: req.file.filename,
            restaurant: restaurantId
        });

        await food.save();
        res.status(201).json({ 
            success: true, 
            message: "Food added successfully", 
            data: food 
        });
    } catch (error) {
        if (req.file) {
            fs.unlink(`uploads/${req.file.filename}`, () => {});
        }
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};

export const listFood = async (req, res) => {
    try {
        const { restaurantId } = req.query;
        let query = {};
        
        if (restaurantId) {
            query.restaurant = restaurantId;
        }

        const foods = await Food.find(query)
            .populate('restaurant')
            .sort({ createdAt: -1 });
            
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching food items" 
        });
    }
};

export const getRestaurantMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const foods = await Food.find({ restaurant: id })
            .populate('restaurant')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching restaurant menu" 
        });
    }
};

export const removeFood = async (req, res) =>{
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "Food ID is required" 
            });
        }

        const food = await Food.findById(id);
        if (!food) {
            return res.status(404).json({ 
                success: false, 
                message: "Food item not found" 
            });
        }

        if (food.image) {
            fs.unlink(`uploads/${food.image}`, (err) => {
                if (err) console.error("Error deleting image:", err);
            });
        }

        await Food.findByIdAndDelete(id);
        res.json({ success: true, message: "Food item removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};