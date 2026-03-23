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
          <p className="text-gray-500">No recipes yet.</p>
        )}

        {recipes.map((recipe: any) => (
          <div
            key={recipe._id}
            className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold text-emerald-700">
              {recipe.title}
            </h2>

            <p className="text-gray-600">{recipe.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
