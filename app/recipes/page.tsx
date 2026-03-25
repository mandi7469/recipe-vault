import Link from "next/link";

async function getRecipes() {
  const res = await fetch("http://localhost:3000/api/recipes", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return res.json();
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <section>
      <h1 className="text-3xl font-bold">Recipes</h1>

      <div className="mt-6 grid gap-4">
        {recipes.length === 0 && (
          <div className="rounded-lg border border-dashed border-emerald-300 bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-emerald-700">
              No recipes yet
            </h2>
            <p className="mt-2 text-gray-600">
              Start building your collection by adding your first recipe.
            </p>
            <Link
              href="/recipes/new"
              className="mt-4 inline-block rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
            >
              Add Your First Recipe
            </Link>
          </div>
        )}

        {recipes.map((recipe: any) => (
          <Link key={recipe._id} href={`/recipes/${recipe._id}`}>
            <div className="cursor-pointer rounded-lg border border-emerald-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-emerald-700">
                  {recipe.title}
                </h2>

                {recipe.difficulty && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    {recipe.difficulty}
                  </span>
                )}
              </div>

              {recipe.description && (
                <p className="mt-2 text-gray-600">{recipe.description}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
                {recipe.category && <span>Category: {recipe.category}</span>}
                {recipe.prepTime && <span>Prep: {recipe.prepTime} min</span>}
                {recipe.servings && <span>Servings: {recipe.servings}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
