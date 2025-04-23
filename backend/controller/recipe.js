const Recipes = require("../models/recipe");
const multer = require('multer');
const mongoose = require("mongoose"); //  New line added for ID validation

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + file.fieldname;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

const getRecipes = async (req, res) => {
    const recipes = await Recipes.find();
    return res.json(recipes);
};

const getRecipe = async (req, res) => {
    const { id } = req.params;

    //  New validation for ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
    }

    try {
        const recipe = await Recipes.findById(id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const imageUrl = recipe.coverImage
            ? `http://localhost:5000/images/${recipe.coverImage}`
            : "";

        res.json({
            ...recipe._doc,
            imageUrl
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching recipe", error: err.message });
    }
};

const addRecipe = async (req, res) => {
    console.log(req.user);
    const { title, ingredients, instructions, time } = req.body;

    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: "Required fields can't be empty" });
    }

    try {
        //  Check if a recipe with the same title already exists for this user
        const existingRecipe = await Recipes.findOne({ title, createdBy: req.user.id });
        if (existingRecipe) {
            return res.status(400).json({ message: "You already have a recipe with this title." });
        }

        // Proceed to create new recipe
        const newRecipe = await Recipes.create({
            title,
            ingredients,
            instructions,
            time,
            coverImage: req.file.filename,
            createdBy: req.user.id
        });

        return res.json(newRecipe);
    } catch (error) {
        console.error("Error creating recipe:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const editRecipe = async (req, res) => {
    const { title, ingredients, instructions, time } = req.body;
    let recipe = await Recipes.findById(req.params.id);

    try {
        if (recipe) {
            let coverImage = req.file?.filename ? req.file.filename : recipe.coverImage;
            const updatedRecipe = await Recipes.findByIdAndUpdate(
                req.params.id,
                { title, ingredients, instructions, time, coverImage },
                { new: true }
            );
            res.json(updatedRecipe);
        } else {
            res.status(404).json({ message: "Recipe not found" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Update failed", error: err.message });
    }
};

const deleteRecipe = async (req, res) => {
    try {
        await Recipes.deleteOne({ _id: req.params.id });
        res.json({ status: "ok" });
    } catch (err) {
        return res.status(400).json({ message: "error" });
    }
};

const searchRecipeByTitle = async (req, res) => {
    const { title } = req.query;

    try {
        const recipes = await Recipes.find({
            title: { $regex: title, $options: 'i' }
        });

        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Search failed", error });
    }
};

module.exports = {
    getRecipes,
    getRecipe,
    addRecipe,
    editRecipe,
    deleteRecipe,
    upload,
    searchRecipeByTitle
};
