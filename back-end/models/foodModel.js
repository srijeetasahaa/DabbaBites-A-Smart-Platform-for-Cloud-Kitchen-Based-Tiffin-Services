import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    restaurant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant',
        required: true 
    }
}, { timestamps: true });

// Check if model already exists to prevent OverwriteModelError
const Food = mongoose.models.Food || mongoose.model('Food', foodSchema);

export default Food;