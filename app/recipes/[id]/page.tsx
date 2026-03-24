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

  return (
    <section className="max-w-3xl">
      <h1 className="text-4xl font-bold">{recipe.title}</h1>

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
