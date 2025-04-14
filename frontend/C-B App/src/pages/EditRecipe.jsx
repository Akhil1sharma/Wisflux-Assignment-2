import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditRecipe() {
  const [recipeData, setRecipeData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipe/${id}`, {
          headers: {
            'authorization': 'bearer ' + localStorage.getItem("token")
          }
        });
        const res = response.data;
        setRecipeData({
          title: res.title,
          ingredients: res.ingredients.join(","),
          instructions: res.instructions,
          time: res.time
        });
        setImagePreview(`http://localhost:5000/images/${res.coverImage}`);
      } catch (err) {
        setError("Failed to fetch recipe data.");
      }
    };
    getData();
  }, [id]);

  const onHandleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      const file = files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
        setRecipeData((prev) => ({ ...prev, file }));
      }
    } else {
      setRecipeData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuillChange = (value) => {
    setRecipeData((prev) => ({ ...prev, instructions: value }));
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const { title, time, ingredients, instructions } = recipeData;

    if (!title || !time || !ingredients || !instructions) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(recipeData).forEach((key) => {
        if (key === "ingredients") {
          // Ensure ingredients are stored as an array
          formData.append("ingredients", recipeData.ingredients.split(","));
        } else {
          formData.append(key, recipeData[key]);
        }
      });

      await axios.put(`http://localhost:5000/recipe/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': 'bearer ' + localStorage.getItem("token")
        }
      });

      navigate("/myRecipe");
    } catch (err) {
      setError("Something went wrong while updating.");
    }
  };

  return (
    <div className="add-recipe-page">
      <h2 className="form-title">Edit Recipe</h2>
      <div className="container">
        <form className='form' onSubmit={onHandleSubmit}>
          <div className='form-control'>
            <label>Title <span className="required">*</span></label>
            <input
              type="text"
              className='input'
              name="title"
              value={recipeData.title || ""}
              onChange={onHandleChange}
            />
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
              value={recipeData.ingredients || ""}
              onChange={onHandleChange}
            ></textarea>
          </div>
          <div className='form-control'>
            <label>Instructions <span className="required">*</span></label>
            <ReactQuill
              value={recipeData.instructions || ""}
              onChange={handleQuillChange}
              theme="snow"
            />
          </div>
          <div className='form-control'>
            <label>Recipe Image</label>
            <input
              type="file"
              className='input'
              name="file"
              accept="image/*"
              onChange={onHandleChange}
            />
            {imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <p>Current Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "200px", borderRadius: "8px" }}
                />
              </div>
            )}
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Update Recipe</button>
        </form>
      </div>
    </div>
  );
}
