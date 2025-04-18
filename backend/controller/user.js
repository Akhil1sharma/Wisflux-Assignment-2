const User = require("../models/user");
const Recipe = require("../models/recipe");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// Signup Controller
const userSignUp = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Email and password are required", 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse("Email is already in use", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    favorites: []
  });

  const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
    expiresIn: "1d" // or use process.env.JWT_EXPIRE if you want from .env
  });

  res.status(201).json({ 
    token, 
    user: {
      _id: newUser._id,
      email: newUser.email,
      favorites: []
    }
  });
});

// Login Controller
const userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Email and password are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 400));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 400));
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d"
  });

  res.status(200).json({ 
    token, 
    user: {
      _id: user._id,
      email: user.email,
      favorites: user.favorites || []
    }
  });
});

// Get Current User Controller
const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('favorites');

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({ 
    token: req.token,
    user: {
      _id: user._id,
      email: user.email,
      favorites: user.favorites || []
    }
  });
});

// Add to Favorites
const addFavorite = asyncHandler(async (req, res, next) => {
  const { recipeId } = req.params;

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    return next(new ErrorResponse(`Recipe not found with id ${recipeId}`, 404));
  }

  const user = await User.findById(req.user.id);

  if (user.favorites.includes(recipeId)) {
    return next(new ErrorResponse('Recipe already in favorites', 400));
  }

  user.favorites.push(recipeId);
  await user.save();

  res.status(200).json({ success: true, message: 'Recipe added to favorites' });
});

// Remove from Favorites
const removeFavorite = asyncHandler(async (req, res, next) => {
  const { recipeId } = req.params;

  const user = await User.findById(req.user.id);

  if (!user.favorites.includes(recipeId)) {
    return next(new ErrorResponse('Recipe not found in favorites', 400));
  }

  user.favorites.pull(recipeId);
  await user.save();

  res.status(200).json({ success: true, message: 'Recipe removed from favorites' });
});

// Get All Favorites
const getFavorites = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('favorites');

  res.status(200).json({
    success: true,
    count: user.favorites.length,
    favorites: user.favorites
  });
});

module.exports = { 
  userLogin, 
  userSignUp, 
  getUser,
  addFavorite,
  removeFavorite,
  getFavorites
};
