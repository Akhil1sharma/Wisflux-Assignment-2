import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import MainNavigation from './components/MainNavigation';
import axios from 'axios';
import AddFoodRecipe from './pages/AddFoodRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';
import LoginPage from './pages/LoginPage';
import MyRecipes from './pages/MyRecipes';
import FavRecipesPage from './pages/FavRecipesPage';
import SearchPage from './pages/SearchPage'; 

import { ToastContainer } from 'react-toastify'; 


// Load all recipes
const getAllRecipes = async () => {
  let allRecipes = [];
  const token = localStorage.getItem('token');  // Fetch the token from localStorage
  await axios.get('http://localhost:5000/recipe', {
    headers: {
      Authorization: `Bearer ${token}`  // Attach token in Authorization header
    }
  }).then(res => {
    allRecipes = res.data;
  });
  return allRecipes;
};

// Load specific recipe details
const getRecipe = async ({ params }) => {
  let recipe;
  const token = localStorage.getItem('token');  // Fetch the token from localStorage
  await axios.get(`http://localhost:5000/recipe/${params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`  // Attach token in Authorization header
    }
  })
    .then(res => recipe = res.data);

  await axios.get(`http://localhost:5000/user/me/${recipe.createdBy}`, {
    headers: {
      Authorization: `Bearer ${token}`  // Attach token in Authorization header
    }
  })
    .then(res => {
      recipe = { ...recipe, email: res.data.email };
    });

  return recipe;
};

// Load favorite recipes from localStorage
const getFavRecipes = () => {
  return JSON.parse(localStorage.getItem("fav")) || [];
};

const router = createBrowserRouter([
  {
    path: "/", element: <MainNavigation />, children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <MyRecipes /> },
      { path: "/favRecipe", element: <FavRecipesPage />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe },
      { path: "/login", element: <LoginPage /> },
      { path: "/search", element: <SearchPage /> } // Added search route
    ]
  }
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer /> 
    </>
  );
}
