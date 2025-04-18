import React, { useEffect, useState } from 'react';
import { getFavorites } from '../services/favoritesService'; // Updated service
import RecipeItems from '../components/RecipeItems';

export default function FavRecipesPage() {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getFavorites();  // Correct endpoint se data fetch hoga
        setFavourites(response.data.favorites || []);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="fav-page">
      <h2 className="my-recipes-heading">Favourite Recipes</h2>
      {favourites.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No favourites yet!</p>
      ) : (
        <RecipeItems recipes={favourites} />
      )}
    </div>
  );
}
