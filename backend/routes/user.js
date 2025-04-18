const express = require("express");
const { userLogin, userSignUp, getUser, addFavorite, removeFavorite, getFavorites } = require("../controller/user");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// Auth routes
router.post("/user/register", userSignUp);     // prefer /register instead of /signUp
router.post("/user/login", userLogin);

// User info route (protected)
router.get("/me/:id", verifyToken, getUser);

// Favorites routes (protected)
router.post("/favorites/:recipeId", verifyToken, addFavorite);
router.delete("/favorites/:recipeId", verifyToken, removeFavorite);
router.get("/favorites", verifyToken, getFavorites);

module.exports = router;
