import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({});
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const onHandleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setRecipeData((pre) => ({ ...pre, [name]: value }));
      fetchSuggestions(value);
    } else {
      let val =
        name === "ingredients"
          ? value.split(",")
          : name === "file"
          ? e.target.files[0]
          : value;

      setRecipeData((pre) => ({ ...pre, [name]: val }));
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await axios.get(`https://forkify-api.herokuapp.com/api/search?q=${query}`);
      setSuggestions(response.data.recipes || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (title) => {
    setRecipeData((pre) => ({ ...pre, title }));
    setShowSuggestions(false);
  };

  const handleQuillChange = (value) => {
    setRecipeData((pre) => ({ ...pre, instructions: value }));
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    const { title, time, ingredients, instructions, file } = recipeData;

    if (!title || !time || !ingredients || !instructions || !file) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/recipe", recipeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': 'bearer ' + localStorage.getItem("token")
        }
      });

      navigate("/myRecipe");
    } catch (err) {
      setError("Something went wrong while submitting.");
    }
  };

  return (
    <div className="add-recipe-page">
      <h2 className="form-title">Add Recipe</h2>
      <div className="container">
        <form className='form' onSubmit={onHandleSubmit}>
          <div className='form-control' style={{ position: 'relative' }}>
            <label>Title</label>
            <input
              type="text"
              className='input'
              name="title"
              value={recipeData.title || ""}
              onChange={onHandleChange}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.recipe_id}
                    onClick={() => handleSuggestionClick(suggestion.title)}
                  >
                    {suggestion.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className='form-control'>
            <label>Time</label>
            <input type="text" className='input' name="time" onChange={onHandleChange} />
          </div>
          <div className='form-control'>
            <label>Ingredients</label>
            <textarea className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange}></textarea>
          </div>
          <div className='form-control'>
            <label>Instructions</label>
            <ReactQuill value={recipeData.instructions || ""} onChange={handleQuillChange} />
          </div>
          <div className='form-control'>
            <label>Recipe Image</label>
            <input type="file" className='input' name="file" onChange={onHandleChange} />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Add Recipe</button>
        </form>
      </div>
    </div>
  );
}
