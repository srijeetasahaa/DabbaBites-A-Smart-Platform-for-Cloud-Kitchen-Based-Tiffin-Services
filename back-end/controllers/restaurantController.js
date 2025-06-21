import { Restaurant, Food } from '../models/index.js';
import fs from 'fs';

// Utility function to delete files with proper error handling
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        reject(new Error("File deletion failed"));
      } else {
        resolve();
      }
    });
  });
};

// Add a new restaurant
export const addRestaurant = async (req, res) => {
  try {
    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const { name, pincode, address, phone, deliveryTime, rating } = req.body;
    
    // Validate required fields
    if (!name || !pincode || !address || !phone) {
      // Delete the uploaded file if validation fails
      await deleteFile(`uploads/${req.file.filename}`);
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Create a new restaurant instance with optional deliveryTime & rating
    const newRestaurant = new Restaurant({
      name,
      pincode,
      address,
      phone,
      image: req.file.filename,
      deliveryTime: deliveryTime || '20-30 min',  // default if not provided
      rating: rating || 4.0                      // default if not provided
    });

    // Save the restaurant
    await newRestaurant.save();
    res.status(201).json({
      success: true,
      message: "Restaurant added successfully",
      data: newRestaurant
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      try {
        await deleteFile(`uploads/${req.file.filename}`);
      } catch (deleteError) {
        console.error("Failed to delete the uploaded file:", deleteError.message);
      }
    }
    console.error('Error in addRestaurant:', error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// List all restaurants with menu items count, deliveryTime & rating defaults
export const listRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({})
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Add menuItemsCount, and ensure deliveryTime & rating exist
    const restaurantsWithMenuCount = await Promise.all(
      restaurants.map(async (restaurant) => {
        const menuItemsCount = await Food.countDocuments({ restaurant: restaurant._id });
        return {
          ...restaurant,
          menuItemsCount,
          deliveryTime: restaurant.deliveryTime || '20-30 min',
          rating: restaurant.rating || 4.0
        };
      })
    );

    res.json({
      success: true,
      data: restaurantsWithMenuCount
    });
  } catch (error) {
    console.error('Error in listRestaurants:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching restaurants"
    });
  }
};

// Get a single restaurant by ID
export const getRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).lean().exec();

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    // Ensure defaults
    restaurant.deliveryTime = restaurant.deliveryTime || '20-30 min';
    restaurant.rating     = restaurant.rating     || 4.0;

    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error in getRestaurant:', error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// Remove a restaurant (and its menu items + image)
export const removeRestaurant = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required"
      });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    // Delete the restaurant's image file
    if (restaurant.image) {
      try {
        await deleteFile(`uploads/${restaurant.image}`);
      } catch (err) {
        console.error("Error deleting image:", err.message);
        return res.status(500).json({
          success: false,
          message: "Failed to delete the restaurant image"
        });
      }
    }

    // Remove all food items associated with this restaurant
    await Food.deleteMany({ restaurant: id });

    // Remove the restaurant from the database
    await Restaurant.findByIdAndDelete(id);
    res.json({ success: true, message: "Restaurant and its menu items removed" });
  } catch (error) {
    console.error('Error in removeRestaurant:', error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};
