import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditRecipe() {
  const [recipeData, setRecipeData] = useState({});
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
      } catch (err) {
        setError("Failed to fetch recipe data.");
      }
    };
    getData();
  }, [id]);

  const onHandleChange = (e) => {
    let val =
      e.target.name === "ingredients"
        ? e.target.value
        : e.target.name === "file"
        ? e.target.files[0]
        : e.target.value;

    setRecipeData((pre) => ({ ...pre, [e.target.name]: val }));
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
        formData.append(key, recipeData[key]);
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
            <label>Title</label>
            <input
              type="text"
              className='input'
              name="title"
              value={recipeData.title || ""}
              onChange={onHandleChange}
            />
          </div>
          <div className='form-control'>
            <label>Time</label>
            <input
              type="number"
              className='input'
              name="time"
              value={recipeData.time || ""}
              onChange={onHandleChange}
            />
          </div>
          <div className='form-control'>
            <label>Ingredients</label>
            <textarea
              className='input-textarea'
              name="ingredients"
              rows="5"
              value={recipeData.ingredients || ""}
              onChange={onHandleChange}
            ></textarea>
          </div>
          <div className='form-control'>
            <label>Instructions</label>
            <ReactQuill
              value={recipeData.instructions || ""}
              onChange={handleQuillChange}
            />
          </div>
          <div className='form-control'>
            <label>Recipe Image</label>
            <input
              type="file"
              className='input'
              name="file"
              onChange={onHandleChange}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Update Recipe</button>
        </form>
      </div>
    </div>
  );
}
