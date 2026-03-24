import Link from "next/link";
import { redirect } from "next/navigation";
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

  async function handleDelete() {
    "use server";

    await fetch(`http://localhost:3000/api/recipes/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    redirect("/recipes");
  }

  return (
    <section className="max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-4xl font-bold text-emerald-700">{recipe.title}</h1>

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
      </div>

      <p className="mt-4 text-lg text-gray-700">{recipe.description}</p>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Instructions</h2>

        {recipe.instructions?.length === 0 ? (
          <p className="mt-2 text-gray-500">No instructions yet.</p>
        ) : (
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {recipe.instructions.map((step: string, index: number) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
