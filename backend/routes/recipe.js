const express = require("express");
const {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
  searchRecipeByTitle // ✅ Import the new controller
} = require("../controller/recipe");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// ✅ Add the search route above /:id to prevent conflicts
router.get("/search", searchRecipeByTitle); // 🔍 Search recipes by title

// ✅ Existing routes (unchanged)
router.get("/", getRecipes); // Get all recipes
router.get("/:id", getRecipe); // Get recipe by id
router.post("/", upload.single('file'), verifyToken, addRecipe); // Add recipe
router.put("/:id", upload.single('file'), editRecipe); // Edit recipe
router.delete("/:id", deleteRecipe); // Delete recipe

module.exports = router;
