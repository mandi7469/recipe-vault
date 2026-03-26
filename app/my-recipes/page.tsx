import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

export default async function MyRecipesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-recipes");
  }

  await connectToDatabase();

  const recipes = await Recipe.find({ userId: session.user.id }).sort({
    createdAt: -1,
  });

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">My Recipes</h1>
          <p className="mt-2 text-gray-600">
            Recipes you’ve created and can manage.
          </p>
        </div>

        <Link
          href="/recipes/new"
          className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Add Recipe
        </Link>
      </div>

      <div className="mt-6 grid gap-4">
        {recipes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-emerald-300 bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-emerald-700">
              You haven’t created any recipes yet
            </h2>
            <p className="mt-2 text-gray-600">
              Start building your personal recipe collection.
            </p>
            <Link
              href="/recipes/new"
              className="mt-4 inline-block rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
            >
              Create Your First Recipe
            </Link>
          </div>
        ) : (
          recipes.map((recipe: any) => (
            <Link key={recipe._id} href={`/recipes/${recipe._id}`}>
              <div className="cursor-pointer rounded-lg border border-emerald-200 bg-white p-4 shadow-sm transition hover:shadow-md">
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
          ))
        )}
      </div>
    </section>
  );
}
