import React, { useEffect, useState } from 'react';
import RecipeItems from '../components/RecipeItems'; // ✅ reuse the component!

export default function FavRecipesPage() {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("fav")) || []; // ✅ key should match what's used in RecipeItems
    setFavourites(favs);
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
