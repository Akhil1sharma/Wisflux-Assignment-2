import React, { useEffect, useState } from 'react'; 
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { BsStopwatchFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import FavoriteButton from './FavoriteButton'; // new import
import { checkIsFavorite } from '../services/favoritesService'; // new import
import axios from 'axios';

export default function RecipeItems({ recipes: propRecipes }) {
    const loadedRecipes = useLoaderData(); // comes from Home page loader
    const navigate = useNavigate();
    const [allRecipes, setAllRecipes] = useState([]);
    const path = window.location.pathname === "/myRecipe";

    useEffect(() => {
        // Use propRecipes if passed, otherwise fallback to loader data
        setAllRecipes(propRecipes || loadedRecipes);
    }, [propRecipes, loadedRecipes]);

    const onDelete = async (id) => {
        await axios.delete(`http://localhost:5000/recipe/${id}`);
        setAllRecipes(recipes => recipes.filter(recipe => recipe._id !== id));
    };

    return (
        <div className='card-container'>
            {allRecipes?.map((item, index) => (
                <CardItem 
                    key={index} 
                    item={item} 
                    path={path} 
                    onDelete={onDelete} 
                    navigate={navigate} 
                />
            ))}
        </div>
    );
}

// Separated CardItem component for clarity
function CardItem({ item, path, onDelete, navigate }) {
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchFavorite = async () => {
            const status = await checkIsFavorite(item._id);
            setIsFavorited(status);
        };
        fetchFavorite();
    }, [item._id]);

    return (
        <div
            className='card'
            onClick={() => navigate(`/recipe/${item._id}`)}
            style={{ cursor: 'pointer' }}
        >
            <img
                src={`http://localhost:5000/images/${item.coverImage}`}
                onError={(e) => e.target.src = "/default-image.jpg"}
                width="120px"
                height="100px"
                alt={item.title}
            />
            <div className='card-body'>
                <div className='title'>{item.title}</div>
                <div className='icons'>
                    <div className='timer'><BsStopwatchFill /> {item.time}</div>
                    {!path ? (
                        <FavoriteButton recipeId={item._id} initialIsFavorite={isFavorited} />
                    ) : (
                        <div className='action'>
                            <Link to={`/editRecipe/${item._id}`} className="editIcon" onClick={(e) => e.stopPropagation()}>
                                <FaEdit />
                            </Link>
                            <MdDelete
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(item._id);
                                }}
                                className='deleteIcon'
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
