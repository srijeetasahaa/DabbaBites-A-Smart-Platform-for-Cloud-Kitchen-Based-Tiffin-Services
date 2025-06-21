import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Header from '../../components/Header/Header';
import AppDownload from '../../components/AppDownload/AppDownload';
import SearchBar from '../../components/SearchBar/SearchBar';
import ReviewSection from '../../components/ReviewSection/ReviewSection';
import { StoreContext } from '../../context/StoreContext';

const Home = () => {
  const navigate = useNavigate();
  const { restaurantsWithMenu, loading, url } = useContext(StoreContext);
  
  // More sophisticated rating algorithm
  const getRandomRating = (popularityFactor = 1) => {
    // Base rating between 3.0-5.0 with normal distribution
    let rating;
    do {
      // Creates bell curve distribution centered around 4.0
      rating = (Math.random() + Math.random() + Math.random()) / 3 * 2 + 3;
      rating = Math.round(rating * 2) / 2; // Round to nearest 0.5
      // Adjust based on popularity (higher popularity = higher potential rating)
      rating = Math.min(5, rating + (Math.random() * 0.5 * popularityFactor));
    } while (rating < 3 || rating > 5);
    return rating;
  };

  // More realistic delivery time generator
  const getRandomDeliveryTime = (distanceFactor = 1) => {
    const baseTimes = [
      { time: '15-25 min', chance: 0.2 },
      { time: '20-30 min', chance: 0.3 },
      { time: '25-35 min', chance: 0.25 },
      { time: '30-40 min', chance: 0.15 },
      { time: '35-45 min', chance: 0.07 },
      { time: '40-50 min', chance: 0.03 }
    ];
    
    // Adjust times based on distance factor (1 = close, 2 = far)
    const adjustedTimes = baseTimes.map(t => ({
      time: t.time.replace(/\d+/g, m => Math.min(60, parseInt(m) * distanceFactor)),
      chance: t.chance / distanceFactor
    }));

    let random = Math.random();
    for (const t of adjustedTimes) {
      if (random < t.chance) return t.time;
      random -= t.chance;
    }
    return adjustedTimes[0].time;
  };

  // Generate popularity score (1-3) based on restaurant properties
  const getPopularityScore = (restaurant) => {
    const factors = [
      restaurant.category === 'Premium' ? 1.5 : 1,
      restaurant.name.length < 12 ? 0.5 : 0, // Shorter names appear more popular
      restaurant.image?.includes('professional') ? 0.5 : 0
    ];
    return 1 + factors.reduce((a, b) => a + b, 0);
  };

  // Get first 3 restaurants to feature
  const featuredRestaurants = restaurantsWithMenu?.slice(0, 3) || [];

  return (
    <div className="home-container">
      <Header />
      <section className="hero-section">
        <div className="hero-content">
        <h1 className="hero-title">Discover the best food in your city</h1>
          <SearchBar variant="hero" />
        </div>
      </section>
      
      <section className="featured-restaurants">
        <div className="section-header">
          <h2>Featured Cloud Kitchens</h2>
          <button className="view-all-btn" onClick={() => navigate('/Menu')}>
            View All Kitchens
          </button>
        </div>
        
        {loading ? (
          <div className="loading-restaurants">
            <div className="spinner"></div>
            <p>Loading restaurants...</p>
          </div>
        ) : (
          <div className="restaurants-grid">
            {featuredRestaurants.map(restaurant => {
              const popularity = getPopularityScore(restaurant);
              const rating = restaurant.rating || getRandomRating(popularity);
              const deliveryTime = restaurant.deliveryTime || getRandomDeliveryTime(popularity > 2 ? 1.2 : 1);
              const ratingClass = rating >= 4.5 ? 'high' : rating >= 3.8 ? 'medium' : 'low';
              const reviewCount = Math.floor(Math.random() * 50 * popularity) + 5; // 5-155 reviews
              
              return (
                <div key={restaurant._id} className="restaurant-card" onClick={() => navigate(`/restaurant/${restaurant._id}`)}>
                  <div className="card-image">
                    <img 
                      src={`${url}/uploads/${restaurant.image}`} 
                      alt={restaurant.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-restaurant.jpg';
                      }}
                      
                    />
                    <div className={`rating-container ${ratingClass}`}>
                      <span className="star-icon">★</span>
                      <span className="rating-value">{rating.toFixed(1)}</span>
                      <span className="review-count">({reviewCount}+)</span>
                    </div>
                    {popularity > 2 && (
                      <div className="popular-badge">Popular</div>
                    )}
                  </div>
                  <div className="card-content">
                    <h3>{restaurant.name}</h3>
                    <div className="restaurant-meta">
                      <span>🕒 {deliveryTime}</span>
                      <span>{restaurant.category || 'Restaurant'}</span>
                    </div>
                    <div className="restaurant-tags">
                      {popularity > 2.5 && <span className="tag">🔥 Hot</span>}
                      {rating > 4.3 && <span className="tag">👍 Recommended</span>}
                      {deliveryTime.includes('15-25') && <span className="tag">⚡ Fast</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <ReviewSection />
      <AppDownload />
    </div>
  );
};

export default Home;