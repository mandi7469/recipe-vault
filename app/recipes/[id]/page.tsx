import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";

async function getRecipe(id: string) {
  const res = await fetch(`http://localhost:3000/api/recipes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipe");
  }

  return res.json();
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  const session = await auth();

  const isOwner = session?.user?.id === recipe.userId?.toString();

  async function handleDelete() {
    "use server";

    const currentSession = await auth();

    if (!currentSession?.user?.id) {
      redirect(`/login?callbackUrl=/recipes/${id}`);
    }

    const res = await fetch(`http://localhost:3000/api/recipes/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error || "Failed to delete recipe");
    }

    redirect("/recipes");
  }

  return (
    <section className="max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-emerald-700">
            {recipe.title}
          </h1>

          {recipe.category && (
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-emerald-600">
              {recipe.category}
            </p>
          )}
        </div>

        {isOwner && (
          <div className="flex gap-3">
            <Link
              href={`/recipes/${id}/edit`}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Edit
            </Link>

            <form action={handleDelete}>
              <DeleteRecipeButton />
            </form>
          </div>
        )}
      </div>

      {recipe.description && (
        <p className="mt-4 text-lg text-gray-700">{recipe.description}</p>
      )}

      <div className="mt-6 grid gap-4 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm text-gray-500">Prep Time</p>
          <p className="font-semibold text-gray-800">
            {recipe.prepTime ? `${recipe.prepTime} min` : "—"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Cook Time</p>
          <p className="font-semibold text-gray-800">
            {recipe.cookTime ? `${recipe.cookTime} min` : "—"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Servings</p>
          <p className="font-semibold text-gray-800">
            {recipe.servings || "—"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Difficulty</p>
          <p className="font-semibold text-gray-800">
            {recipe.difficulty || "—"}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Ingredients</h2>

          {recipe.ingredients?.length === 0 ? (
            <p className="mt-3 text-gray-500">No ingredients listed yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {recipe.ingredients.map(
                (
                  ingredient: { name: string; amount: string },
                  index: number,
                ) => (
                  <li
                    key={index}
                    className="rounded-md border border-gray-200 bg-white px-4 py-3"
                  >
                    <span className="font-medium text-gray-900">
                      {ingredient.name}
                    </span>
                    <span className="ml-2 text-gray-600">
                      — {ingredient.amount}
                    </span>
                  </li>
                ),
              )}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Instructions</h2>

          {recipe.instructions?.length === 0 ? (
            <p className="mt-3 text-gray-500">No instructions yet.</p>
          ) : (
            <ol className="mt-3 space-y-3">
              {recipe.instructions.map((step: string, index: number) => (
                <li
                  key={index}
                  className="rounded-md border border-gray-200 bg-white px-4 py-3"
                >
                  <span className="mr-2 font-semibold text-emerald-700">
                    Step {index + 1}:
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
