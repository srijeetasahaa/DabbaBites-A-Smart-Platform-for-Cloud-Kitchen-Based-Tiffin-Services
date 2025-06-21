import React from 'react';
import './FirstOrderGift.css';

const FirstOrderGift = ({ onClose }) => {
  return (
    <div className="gift-popup">
      <div className="gift-popup-container">
        <h2>🎁 Thank You for Signing Up!</h2>
        <p>
          As part of our <strong>eco-friendly initiative</strong>, you'll receive a <strong>free plant</strong> with your first order. 🌿
        </p>
        <button onClick={onClose}>Got it!</button>
      </div>
    </div>
  );
};

export default FirstOrderGift;
