import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import Header from '../../components/Header/Header';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantsWithMenu = [], url } = useContext(StoreContext);
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q') || '';
  const searchType = queryParams.get('type') || 'restaurant';

  // Safe access to properties with default values
  const getSafeString = (obj, prop) => {
    return (obj?.[prop] || '').toString().toLowerCase();
  };

  const filteredResults = searchType === 'restaurant'
    ? restaurantsWithMenu.filter(restaurant => {
        const name = getSafeString(restaurant, 'name');
        const category = getSafeString(restaurant, 'category');
        const address = getSafeString(restaurant, 'address');
        
        return name.includes(searchTerm.toLowerCase()) ||
               category.includes(searchTerm.toLowerCase()) ||
               address.includes(searchTerm.toLowerCase());
      })
    : restaurantsWithMenu.reduce((acc, restaurant) => {
        const matchingItems = restaurant.menuItems?.filter(item => {
          const itemName = getSafeString(item, 'name');
          const itemDesc = getSafeString(item, 'description');
          const itemCat = getSafeString(item, 'category');
          
          return itemName.includes(searchTerm.toLowerCase()) ||
                 itemDesc.includes(searchTerm.toLowerCase()) ||
                 itemCat.includes(searchTerm.toLowerCase());
        }) || [];
        
        if (matchingItems.length > 0) {
          acc.push({
            ...restaurant,
            filteredMenu: matchingItems,
            highlightTerms: searchTerm.toLowerCase().split(' ')
          });
        }
        return acc;
      }, []);

  // Rest of your component remains the same...
  const highlightText = (text) => {
    if (!searchTerm || !text) return { __html: text || '' };
    
    const terms = searchTerm.toLowerCase().split(' ');
    let result = text.toString();
    
    terms.forEach(term => {
      if (term.length > 2) {
        const regex = new RegExp(`(${term})`, 'gi');
        result = result.replace(regex, '<span class="highlight">$1</span>');
      }
    });
    
    return { __html: result };
  };

  const handleRestaurantClick = (id) => {
    if (id) navigate(`/restaurant/${id}`);
  };

  return (
    <div className="search-page">
      <Header />
      
      <div className="search-results-container">
        <div className="search-header">
          <h2>Search Results for "{searchTerm}"</h2>
          <p>{filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found</p>
          
          <div className="search-type-tabs">
            <button 
              className={searchType === 'restaurant' ? 'active' : ''}
              onClick={() => navigate(`/search?q=${searchTerm}&type=restaurant`)}
            >
              Restaurants
            </button>
            <button 
              className={searchType === 'item' ? 'active' : ''}
              onClick={() => navigate(`/search?q=${searchTerm}&type=item`)}
            >
              Menu Items
            </button>
          </div>
        </div>
        
        {filteredResults.length > 0 ? (
          <div className="results-grid">
            {filteredResults.map(result => {
              if (!result) return null;
              
              const rating = result.rating || 4.0;
              const deliveryTime = result.deliveryTime || '20-30 min';
              const ratingClass = rating >= 4.5 ? 'high' : rating >= 3.8 ? 'medium' : 'low';
              const reviewCount = Math.floor(Math.random() * 100) + 5;

              return (
                <div 
                  key={result._id || Math.random()} 
                  className="result-card"
                  onClick={() => handleRestaurantClick(result._id)}
                >
                  <div className="card-image">
                    <img 
                      src={result.image ? `${url}/uploads/${result.image}` : '/default-restaurant.jpg'} 
                      alt={result.name || 'Restaurant'}
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
                  </div>
                  
                  <div className="card-content">
                    <h3 dangerouslySetInnerHTML={highlightText(result.name)} />
                    <div className="restaurant-meta">
                      <span>🕒 {deliveryTime}</span>
                      <span dangerouslySetInnerHTML={highlightText(result.category || 'Restaurant')} />
                    </div>
                    
                    {searchType === 'item' && result.filteredMenu && (
                      <div className="matched-items">
                        <h4>Matching Items ({result.filteredMenu.length}):</h4>
                        <ul>
                          {result.filteredMenu.slice(0, 3).map(item => (
                            <li key={item._id || Math.random()}>
                              <span dangerouslySetInnerHTML={highlightText(item.name)} /> 
                              <span className="item-price"> - ₹{item.price || '0'}</span>
                              {item.description && (
                                <p 
                                  className="item-description"
                                  dangerouslySetInnerHTML={highlightText(item.description)}
                                />
                              )}
                            </li>
                          ))}
                          {result.filteredMenu.length > 3 && (
                            <li className="more-items">
                              +{result.filteredMenu.length - 3} more items...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results">
            <p>No results found for "{searchTerm}"</p>
            <button 
              className="try-again-btn"
              onClick={() => navigate('/')}
            >
              Try a different search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;