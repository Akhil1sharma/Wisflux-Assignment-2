import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeItems from '../components/RecipeItems'; // component to display recipe cards

export default function MyRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userFound, setUserFound] = useState(true);

    useEffect(() => {
        const fetchMyRecipes = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                setUserFound(false);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/recipe");
                const myRecipes = response.data.filter(recipe => recipe.createdBy === user._id);
                setRecipes(myRecipes);
            } catch (error) {
                console.error("Failed to fetch recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyRecipes();
    }, []);

    return (
        <div className="add-recipe-page">
            <h2 className="my-recipes-heading">My Recipes</h2>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading your recipes...</p>
            ) : !userFound ? (
                <p style={{ textAlign: 'center' }}>Please log in to see your recipes.</p>
            ) : recipes.length > 0 ? (
                <div className="card-container">
                    <RecipeItems recipes={recipes} />
                </div>
            ) : (
                <p style={{ textAlign: 'center' }}>No recipes found.</p>
            )}
        </div>
    );
}
