import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FavoriteButton.css';

const FavoriteButton = ({ recipeId, initialIsFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite || false);

  useEffect(() => {
    // jab initialIsFavorite prop change ho, toh state update karo
    setIsFavorite(initialIsFavorite || false);
  }, [initialIsFavorite]);

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      console.log("Recipe ID:", recipeId);
      console.log("Token config:", config);

      if (isFavorite) {
        await axios.delete(`http://localhost:5000/user/favorites/${recipeId}`, config);
      } else {
        await axios.post(`http://localhost:5000/user/favorites/${recipeId}`, {}, config);
      }

      setIsFavorite(!isFavorite); // status flip karo
    } catch (error) {
      console.error('Error toggling favorite:', error?.response || error);
      alert('Failed to update favorite status');
    }
  };

  return (
    <div className="favorite-button">
      <span 
        className={`heart ${isFavorite ? 'active' : ''}`}
        onClick={toggleFavorite}
      >
        ❤
      </span>
    </div>
  );
};

export default FavoriteButton;
