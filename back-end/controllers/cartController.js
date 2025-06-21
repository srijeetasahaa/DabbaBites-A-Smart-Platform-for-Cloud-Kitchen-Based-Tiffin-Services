import userModel from "../models/userModel.js";

// add items to user cart
const addToCart = async (req, res) => {
    try {
        const { itemId, restaurantId } = req.body;
        const userId = req.user.id; // From auth middleware

        // Find and update user document
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Initialize cart structure
        user.cartData = user.cartData || {};
        user.cartData[restaurantId] = user.cartData[restaurantId] || {};
        
        // Update quantity
        user.cartData[restaurantId][itemId] = (user.cartData[restaurantId][itemId] || 0) + 1;

        // Save the entire document
        await user.save();

        res.json({
            success: true,
            message: "Added to cart",
            cartData: user.cartData
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update cart",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true, message:"Removed from cart"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
        
    }
}

// fetch user cart data
const getCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({
            success: true,
            cartData: user.cartData || {}
        });
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart"
        });
    }
}

export {addToCart, removeFromCart, getCart}