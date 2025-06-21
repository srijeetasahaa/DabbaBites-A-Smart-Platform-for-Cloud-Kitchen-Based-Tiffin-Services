import express from 'express';
import { createReview, getReviews } from '../controllers/reviewController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// POST /api/reviews - Create a new review
router.post('/', authMiddleware, upload.single('image'), createReview);

// GET /api/reviews - Get all reviews
router.get('/', getReviews);

export default router;