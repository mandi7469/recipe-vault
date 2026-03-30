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
  cookTime?: number;
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

  function clearFilters() {
    setSearch("");
    setCategory("");
    setDifficulty("");
    setSort("newest");
    setPage(1);
  }

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

  function getVisiblePages(currentPage: number, totalPages: number) {
    const windowSize = 2;

    let start = currentPage;
    let end = currentPage + windowSize - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - windowSize + 1);
    }

    const pages: (number | string)[] = [];

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push("...");
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <p className="text-sm text-gray-500">Showing 5 per page</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-5">
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
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {recipes.length === 0 && (
          <p className="text-gray-500">No matching recipes found.</p>
        )}

        {recipes.map((recipe) => (
          <Link key={recipe._id} href={`/recipes/${recipe._id}`}>
            <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg cursor-pointer">
              <h2 className="text-center text-xl font-semibold text-emerald-700 sm:text-left">
                {recipe.title}
              </h2>

              {recipe.description && (
                <p className="text-center text-gray-600 sm:text-left">
                  {recipe.description}
                </p>
              )}

              <div className="mt-2 flex flex-wrap justify-center gap-2 text-center text-xs text-gray-500 sm:justify-start sm:gap-3 sm:text-left sm:text-sm">
                {recipe.category && <span>{recipe.category}</span>}
                {recipe.prepTime && <span>{recipe.prepTime} min prep</span>}
                {recipe.cookTime && <span>{recipe.cookTime} min cook</span>}
                {recipe.difficulty && <span>{recipe.difficulty}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 overflow-x-auto pb-1 sm:overflow-visible sm:pb-0">
          <div className="mx-auto flex w-max flex-nowrap items-center justify-center gap-1 sm:w-auto sm:flex-wrap sm:gap-3">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="shrink-0 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
            >
              <span className="sm:hidden">Prev</span>
              <span className="hidden sm:inline">Previous</span>
            </button>

            {getVisiblePages(page, totalPages).map((item, index) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="shrink-0 px-2 text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item as number)}
                  className={`shrink-0 rounded-md px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm ${
                    page === item
                      ? "bg-emerald-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="shrink-0 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
            >
              <span className="sm:hidden">Next</span>
              <span className="hidden sm:inline">Next</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
