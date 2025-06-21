import Review from '../models/reviewModel.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    const review = new Review({
      user: req.user.id,
      rating,
      text,
      image
    });

    const savedReview = await review.save();
    
    // Populate user details
    const populatedReview = await Review.findById(savedReview._id)
      .populate('user', 'name avatar');
    
    res.status(201).json({
      success: true,
      review: populatedReview
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};