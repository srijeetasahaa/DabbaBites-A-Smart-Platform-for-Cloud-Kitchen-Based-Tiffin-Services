import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import search_icon from '../../assets/search_icon.png';
import './SearchBar.css';

const SearchBar = ({ variant = 'default' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('restaurant');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}&type=${searchType}`);
    }
  };

  return (
    <div className={`search-container ${variant}`}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder={
              searchType === 'restaurant' 
                ? "Search restaurants by name, category or location..." 
                : "Search menu items..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <img src={search_icon} alt="Search" className="search-icon" />
          </button>
        </div>
        
        {variant === 'expanded' && (
          <div className="search-options">
            <label className={searchType === 'restaurant' ? 'active' : ''}>
              <input
                type="radio"
                name="searchType"
                checked={searchType === 'restaurant'}
                onChange={() => setSearchType('restaurant')}
              />
              Restaurants
            </label>
            <label className={searchType === 'item' ? 'active' : ''}>
              <input
                type="radio"
                name="searchType"
                checked={searchType === 'item'}
                onChange={() => setSearchType('item')}
              />
              Menu Items
            </label>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;