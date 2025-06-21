import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext.jsx';
import './ReviewSection.css';
import { assets } from '../../assets/assets.js';

const API_BASE = 'http://localhost:4000'; // Consider moving to .env

const ReviewSection = () => {
  const { token, user } = useContext(StoreContext);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [preview, setPreview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/api/reviews`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
           'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('Fetch error details:', err);
      setError(err.message || 'Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setError('Please select an image smaller than 5MB');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim() || rating <= 0) {
      setError('Please add a rating and review text');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('text', reviewText);
      
      const fileInput = document.getElementById('imageUpload');
      if (fileInput.files[0]) {
        formData.append('image', fileInput.files[0]);
      }

      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const data = await response.json();
      setReviews([data.review, ...reviews]);
      setReviewText('');
      setRating(0);
      setPreview(null);
      fileInput.value = '';
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="review-section" id="reviews">
      <div className="review-container">
        <h2 className="section-title">Dining Experiences Shared by Our Foodies</h2>
        <p className="section-subtitle">Join our community of food lovers</p>

        {error && <div className="error-message">{error}</div>}

        {token ? (
          <form onSubmit={handleSubmit} className="review-form glass-card">
            <div className="form-header">
              <h3>Share Your Experience</h3>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= rating ? 'star filled' : 'star'}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about your meal... What did you love? Any recommendations?"
              required
            />

            <div className="form-footer">
              <div className="image-upload">
                <label htmlFor="imageUpload" className="upload-btn">
                  {preview ? (
                    <img src={preview} alt="Preview" className="image-preview" />
                  ) : (
                    <>
                      <span className="icon">📷</span>
                      <span>Add Food Photo</span>
                    </>
                  )}
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Posting...' : 'Post Review'}
              </button>
            </div>
          </form>
        ) : (
          <div className="login-prompt glass-card">
            <div className="prompt-content">
              <h3>Join the Conversation</h3>
              <p>Sign in to share your dining experience and see what others are saying</p>
            </div>
          </div>
        )}

        <div className="reviews-grid">
          {isLoading && !reviews.length ? (
            <div className="loading">Loading reviews...</div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="review-card glass-card">
                <div className="user-profile">
                  <img 
                    src={review.user?.avatar || assets.profile_icon} 
                    alt={review.user?.name || 'User'} 
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <h4>{review.user?.name || 'Anonymous'}</h4>
                    <div className="user-rating">
                      <span className="stars">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="date">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="review-content">
                  <p>{review.text}</p>
                  {review.image && (
                    <div className="food-images">
                      <img 
                        src={`${API_BASE}${review.image.startsWith('/') ? '' : '/'}${review.image}`} 
                        alt="Food" 
                        className="review-image"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-reviews">No reviews yet. Be the first to share your experience!</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;