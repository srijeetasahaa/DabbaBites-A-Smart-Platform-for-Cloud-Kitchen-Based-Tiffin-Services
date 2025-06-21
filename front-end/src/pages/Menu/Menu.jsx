import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './Menu.css';

const Menu = ({ category = "All" }) => {
  const { restaurantsWithMenu = [], loading, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const getRandomRating = () => {
    // More natural rating distribution (bell curve)
    const baseRating = Math.random() * 2 + 3; // 3-5 range
    return Math.round(baseRating * 2) / 2; // Round to nearest 0.5
  };

  const getRandomDeliveryTime = () => {
    const times = [
      '15-25 min',
      '20-30 min',
      '25-35 min',
      '30-40 min',
      '35-45 min',
      '40-50 min'
    ];
    return times[Math.floor(Math.random() * times.length)];
  };

  const getImageSource = (restaurant) => {
    try {
      return restaurant.image.includes('http') 
        ? restaurant.image 
        : `${url}/uploads/${restaurant.image}`;
    } catch {
      return '/fallback-restaurant.jpg';
    }
  };

  return (
    <section className="restaurant-display">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">Discover Cloud Kitchens</h2>
          <p className="section-subtitle">Find the best dining experiences near you</p>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading restaurants...</p>
          </div>
        ) : (
          <div className="restaurant-grid">
            {restaurantsWithMenu
              .filter(r => category === "All" || r.category === category)
              .map((restaurant, index) => {
                const rating = restaurant.rating || getRandomRating();
                const deliveryTime = restaurant.deliveryTime || getRandomDeliveryTime();
                const ratingClass = rating >= 4.5 ? 'high' : rating >= 3.8 ? 'medium' : 'low';
                const reviewCount = Math.floor(Math.random() * 100) + 5; // 5-104 reviews
                
                return (
                  <article
                    key={restaurant._id}
                    className="restaurant-card"
                    onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                    style={{ '--delay': index * 0.1 + 's' }}
                  >
                    <div className="card-image">
                      <img
                        src={getImageSource(restaurant)}
                        alt={restaurant.name}
                        loading="lazy"
                        onError={(e) => {
  e.target.onerror = null;
  e.target.src = '/default-restaurant.jpg';
}}

                      />
                      <div className={`rating-container ${ratingClass}`}>
                        <span className="star-icon">★</span>
                        <span className="rating-value">{rating.toFixed(1)}</span>
                        <span className="review-count">({reviewCount})</span>
                      </div>
                    </div>
                    <div className="card-content">
                      <h3 className="restaurant-name">{restaurant.name}</h3>
                      <div className="restaurant-meta">
                        <span className="delivery-time">🕒 {deliveryTime}</span>
                        <span className="category-tag">
                          {restaurant.category || 'Restaurant'}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;