"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RECIPE_CATEGORIES } from "@/lib/constants";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("newest");

  async function fetchRecipes() {
    const params = new URLSearchParams({
      search,
      category,
      difficulty,
      sort,
    });

    const res = await fetch(`/api/recipes?${params.toString()}`);
    const data = await res.json();

    setRecipes(data);
  }

  useEffect(() => {
    fetchRecipes();
  }, [search, category, difficulty, sort]);

  return (
    <section>
      <h1 className="text-3xl font-bold">Recipes</h1>

      {/* Controls */}
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-gray-300 p-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-gray-300 p-2"
        >
          <option value="">All Categories</option>
          {RECIPE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded-md border border-gray-300 p-2"
        >
          <option value="">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-md border border-gray-300 p-2"
        >
          <option value="newest">Newest</option>
          <option value="prepTime">Prep Time</option>
          <option value="cookTime">Cook Time</option>
        </select>
      </div>

      {/* Results */}
      <div className="mt-6 grid gap-4">
        {recipes.length === 0 && (
          <p className="text-gray-500">No matching recipes found.</p>
        )}

        {recipes.map((recipe: any) => (
          <Link key={recipe._id} href={`/recipes/${recipe._id}`}>
            <div className="cursor-pointer rounded-lg border border-emerald-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <h2 className="text-xl font-semibold text-emerald-700">
                {recipe.title}
              </h2>

              <p className="text-gray-600">{recipe.description}</p>

              <div className="mt-2 text-sm text-gray-500 flex gap-3">
                {recipe.category && <span>{recipe.category}</span>}
                {recipe.prepTime && <span>{recipe.prepTime} min</span>}
                {recipe.difficulty && <span>{recipe.difficulty}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
