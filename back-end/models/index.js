import mongoose from 'mongoose';
import Restaurant from './restaurantModel.js';
import Food from './foodModel.js';

// Create the Models object
const Models = {
    Food,
    Restaurant
};

// Named exports
export { Food, Restaurant };

// Default export
export default Models;