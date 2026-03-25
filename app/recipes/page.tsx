"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RECIPE_CATEGORIES } from "@/lib/constants";
import useDebounce from "@/components/useDebounce";

type Recipe = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  prepTime?: number;
  difficulty?: string;
};

export default function RecipesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [difficulty, setDifficulty] = useState(
    searchParams.get("difficulty") || "",
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page") || "1"));

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category", category);
    if (difficulty) params.set("difficulty", difficulty);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "5");

    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, category, difficulty, sort, page, pathname, router]);

  useEffect(() => {
    async function fetchRecipes() {
      const params = new URLSearchParams();

      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category) params.set("category", category);
      if (difficulty) params.set("difficulty", difficulty);
      if (sort) params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "5");

      const res = await fetch(`/api/recipes?${params.toString()}`);
      const data = await res.json();

      setRecipes(data.recipes);
      setTotalPages(data.totalPages || 1);
    }

    fetchRecipes();
  }, [debouncedSearch, category, difficulty, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, difficulty, sort]);

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <p className="text-sm text-gray-500">Showing 5 per page</p>
      </div>

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

      <div className="mt-6 grid gap-4">
        {recipes.length === 0 && (
          <p className="text-gray-500">No matching recipes found.</p>
        )}

        {recipes.map((recipe) => (
          <Link key={recipe._id} href={`/recipes/${recipe._id}`}>
            <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg cursor-pointer">
              <h2 className="text-xl font-semibold text-emerald-700">
                {recipe.title}
              </h2>

              {recipe.description && (
                <p className="text-gray-600">{recipe.description}</p>
              )}

              <div className="mt-2 flex gap-3 text-sm text-gray-500">
                {recipe.category && <span>{recipe.category}</span>}
                {recipe.prepTime && <span>{recipe.prepTime} min</span>}
                {recipe.difficulty && <span>{recipe.difficulty}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
