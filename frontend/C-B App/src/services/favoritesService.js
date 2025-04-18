import axios from 'axios';

const API_URL = "http://localhost:5000"; // no .env used!

const getConfig = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not Authenticated');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const addToFavorites = (recipeId) => axios.post(`${API_URL}/user/favorites/${recipeId}`, {}, getConfig());
export const removeFromFavorites = (recipeId) => axios.delete(`${API_URL}/user/favorites/${recipeId}`, getConfig());
export const getFavorites = () => axios.get(`${API_URL}/user/favorites`, getConfig());
export const checkIsFavorite = async (recipeId) => {
  const response = await getFavorites();
  return response.data.favorites.some((r) => r._id === recipeId);
};
