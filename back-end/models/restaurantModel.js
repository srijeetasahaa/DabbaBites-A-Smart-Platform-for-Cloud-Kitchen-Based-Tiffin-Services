import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    image: { type: String, required: true },
    deliveryTime: { type: String, default: '20-30 min' },
    rating: { type: Number, default: 4.0 }
}, { timestamps: true });

// Check if model already exists to prevent OverwriteModelError
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;