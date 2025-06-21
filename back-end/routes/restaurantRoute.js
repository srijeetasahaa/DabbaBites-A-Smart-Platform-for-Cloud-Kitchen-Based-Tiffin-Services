import express from "express";
import { addRestaurant, listRestaurants, getRestaurant, removeRestaurant } from "../controllers/restaurantController.js";
import multer from "multer";
import path from "path";

const restaurantRouter = express.Router();

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
});

// Define the routes
restaurantRouter.post("/add", upload.single("image"), addRestaurant); // Add a new restaurant
restaurantRouter.get("/list", listRestaurants); // Get all restaurants
restaurantRouter.post("/remove", removeRestaurant); // Remove a restaurant


restaurantRouter.get("/:id", getRestaurant); // Get a restaurant by ID

export default restaurantRouter;
