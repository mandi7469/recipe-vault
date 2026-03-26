import mongoose, { Schema, models, model } from "mongoose";

const IngredientSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
});

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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Recipe = models.Recipe || model("Recipe", RecipeSchema);

export default Recipe;
