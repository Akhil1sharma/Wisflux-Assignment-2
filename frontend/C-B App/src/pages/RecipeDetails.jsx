import React, { useState, useEffect } from 'react';
import profileImg from '../assets/profile.png';
import food from '../assets/foodRecipe.png';
import { useLoaderData, useParams } from 'react-router-dom';
import axios from 'axios';
import FavoriteButton from '../components/FavoriteButton'; // new import
import { checkIsFavorite } from '../services/favoritesService'; // new import

export default function RecipeDetails() {
    const { id } = useParams();
    const loaderRecipe = useLoaderData(); // loader data already provides recipe data
    const [recipe, setRecipe] = useState(loaderRecipe);
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        // If loaderRecipe is empty or not available, fetch from backend
        if (!loaderRecipe) {
            const fetchRecipe = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/recipe/${id}`);
                    setRecipe(response.data);  // Set recipe from backend
                } catch (error) {
                    console.error("Error fetching recipe:", error);
                }
            };
            fetchRecipe();
        }
        
        // Check if the recipe is favorited
        const fetchFavorite = async () => {
            const status = await checkIsFavorite(id);
            setIsFavorited(status);
        };

        fetchFavorite();
    }, [id, loaderRecipe]);  // only trigger when id or loaderRecipe changes

    // If no recipe data is loaded, show loading
    if (!recipe) return <div>Loading...</div>;

    return (
        <>
            <div className='outer-container'>
                <div className='profile'>
                    <img src={profileImg} width="50px" height="50px" alt="Profile" />
                    <h5>{recipe.email}</h5>
                </div>

                <h3 className='title'>{recipe.title}</h3>
                {/* Favorite button next to title */}
                <FavoriteButton recipeId={recipe._id} initialIsFavorite={isFavorited} />

                {recipe.time && (
                    <p className="time"><strong>Time:</strong> {recipe.time} minutes</p>
                )}
                <img 
                    src={`http://localhost:5000/images/${recipe.coverImage || "default-recipe.jpg"}`} 
                    width="220px" 
                    height="200px" 
                    alt="Recipe" 
                />

                <div className='recipe-details'>
                    <div className='ingredients'>
                        <h4>Ingredients</h4>
                        <ul>
                            {recipe.ingredients?.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='instructions'>
                        <h4>Instructions</h4>
                        <span>{recipe.instructions}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
