"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RECIPE_CATEGORIES } from "@/lib/constants";

type Ingredient = {
  name: string;
  amount: string;
};

export default function NewRecipeForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "" },
  ]);
  const [instructionsText, setInstructionsText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function updateIngredient(
    index: number,
    field: keyof Ingredient,
    value: string,
  ) {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  }

  function addIngredient() {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Recipe title is required.");
      return;
    }

    const cleanedIngredients = ingredients.filter(
      (ingredient) => ingredient.name.trim() && ingredient.amount.trim(),
    );

    const instructions = instructionsText
      .split("\n")
      .map((step) => step.trim())
      .filter(Boolean);

    try {
      setIsSaving(true);

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          prepTime: prepTime ? Number(prepTime) : undefined,
          cookTime: cookTime ? Number(cookTime) : undefined,
          servings: servings ? Number(servings) : undefined,
          category: category.trim(),
          difficulty,
          ingredients: cleanedIngredients,
          instructions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create recipe");
      }

      router.push("/recipes");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the recipe.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="max-w-3xl">
      <h1 className="text-3xl font-bold text-emerald-700">Add New Recipe</h1>
      <p className="mt-2 text-gray-600">Add the details for your new recipe.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        {/* keep the rest of your current form exactly as it is */}
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Recipe Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Ex: Creamy Garlic Pasta"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-2"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Briefly describe the recipe"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-2"
            rows={4}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Prep Time (min)
            </label>
            <input
              type="number"
              min="0"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white p-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Cook Time (min)
            </label>
            <input
              type="number"
              min="0"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white p-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Servings
            </label>
            <input
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white p-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white p-2"
            >
              <option value="">Select a category</option>
              {RECIPE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-2"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Ingredients
            </label>
            <button
              type="button"
              onClick={addIngredient}
              className="rounded-md border border-emerald-600 px-3 py-1 text-sm text-emerald-700 hover:bg-emerald-50"
            >
              Add Ingredient
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChange={(e) =>
                    updateIngredient(index, "name", e.target.value)
                  }
                  className="rounded-md border border-gray-300 bg-white p-2"
                />

                <input
                  type="text"
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChange={(e) =>
                    updateIngredient(index, "amount", e.target.value)
                  }
                  className="rounded-md border border-gray-300 bg-white p-2"
                />

                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="rounded-md border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="instructions"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Instructions
          </label>
          <textarea
            id="instructions"
            placeholder="Enter one instruction per line"
            value={instructionsText}
            onChange={(e) => setInstructionsText(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-2"
            rows={6}
          />
          <p className="mt-1 text-sm text-gray-500">Add one step per line.</p>
        </div>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Recipe"}
          </button>

          <Link
            href="/recipes"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
