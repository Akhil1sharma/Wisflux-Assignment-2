import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function RecipeItems({ recipes: propRecipes }) {
    const loadedRecipes = useLoaderData(); // comes from Home page loader
    const navigate = useNavigate();
    const [allRecipes, setAllRecipes] = useState([]);
    const [isFavRecipe, setIsFavRecipe] = useState(false);
    const path = window.location.pathname === "/myRecipe";
    let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];

    useEffect(() => {
        // Use propRecipes if passed, otherwise fallback to loader data
        setAllRecipes(propRecipes || loadedRecipes);
    }, [propRecipes, loadedRecipes]);

    const onDelete = async (id) => {
        await axios.delete(`http://localhost:5000/recipe/${id}`);
        setAllRecipes(recipes => recipes.filter(recipe => recipe._id !== id));
        let filterItem = favItems.filter(recipe => recipe._id !== id);
        localStorage.setItem("fav", JSON.stringify(filterItem));
    };

    const favRecipe = (item) => {
        let isAlreadyFav = favItems.some(recipe => recipe._id === item._id);
        let updatedFav = isAlreadyFav
            ? favItems.filter(recipe => recipe._id !== item._id)
            : [...favItems, item];
        localStorage.setItem("fav", JSON.stringify(updatedFav));
        setIsFavRecipe(prev => !prev); // just to force re-render
    };

    return (
        <div className='card-container'>
            {allRecipes?.map((item, index) => (
                <div
                    key={index}
                    className='card'
                    onClick={() => navigate(`/recipe/${item._id}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <img src={`http://localhost:5000/images/${item.coverImage}`} width="120px" height="100px" alt={item.title} />
                    <div className='card-body'>
                        <div className='title'>{item.title}</div>
                        <div className='icons'>
                            <div className='timer'><BsStopwatchFill /> {item.time}</div>
                            {!path ? (
                                <FaHeart
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        favRecipe(item);
                                    }}
                                    style={{ color: favItems.some(res => res._id === item._id) ? "red" : "" }}
                                />
                            ) : (
                                <div className='action'>
                                    <Link to={`/editRecipe/${item._id}`} className="editIcon" onClick={(e) => e.stopPropagation()}><FaEdit /></Link>
                                    <MdDelete onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item._id);
                                    }} className='deleteIcon' />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
