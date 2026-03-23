import mongoose, { Schema, models, model } from "mongoose";

// Define the Ingredient subdocument schema for the Recipe model 
const IngredientSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
});

// Define the main Recipe schema with various fields and validation rules 
const RecipeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    ingredients: [IngredientSchema],
    instructions: [{ type: String }],
    prepTime: Number,
    cookTime: Number,
    servings: Number,
    category: String,
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
    },
  },
  { timestamps: true },
);

const Recipe = models.Recipe || model("Recipe", RecipeSchema);

export default Recipe;
