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
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const onHandleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "title") {
      setRecipeData((pre) => ({ ...pre, [name]: value }));
      fetchSuggestions(value);
    } else if (name === "file") {
      const file = files[0];
      setRecipeData((pre) => ({ ...pre, file }));
      setPreview(URL.createObjectURL(file)); // Preview the uploaded image
    } else {
      let val = name === "ingredients" ? value.split(",") : value;
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

    // Validate all required fields, including the file (image upload)
    if (!title || !time || !ingredients || !instructions || !file) {
      setError("Please fill in all fields, including the image.");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(recipeData).forEach((key) => {
        formData.append(key, recipeData[key]);
      });

      await axios.post("http://localhost:5000/recipe", formData, {
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
            <label>Title <span className="required">*</span></label>
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
            <label>Time (in minutes) <span className="required">*</span></label>
            <input
              type="number"
              className='input'
              name="time"
              value={recipeData.time || ""}
              onChange={onHandleChange}
            />
          </div>

          <div className='form-control'>
            <label>Ingredients (comma-separated) <span className="required">*</span></label>
            <textarea
              className='input-textarea'
              name="ingredients"
              rows="5"
              value={recipeData.ingredients?.join(",") || ""}
              onChange={onHandleChange}
            ></textarea>
          </div>

          <div className='form-control'>
            <label>Instructions <span className="required">*</span></label>
            <ReactQuill value={recipeData.instructions || ""} onChange={handleQuillChange} />
          </div>

          <div className='form-control'>
            <label>Recipe Image <span className="required">*</span></label>
            <input type="file" className='input' name="file" onChange={onHandleChange} />
            {preview && <img src={preview} alt="Preview" className="preview-img" />}
          </div>

          {error && <p className="error">{error}</p>}
          <button type="submit">Add Recipe</button>
        </form>
      </div>
    </div>
  );
}
