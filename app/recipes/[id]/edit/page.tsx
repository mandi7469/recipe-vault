"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadRecipe() {
      const resolvedParams = await params;
      setId(resolvedParams.id);

      const res = await fetch(`/api/recipes/${resolvedParams.id}`);
      const recipe = await res.json();

      setTitle(recipe.title || "");
      setDescription(recipe.description || "");
    }

    loadRecipe();
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    router.push(`/recipes/${id}`);
    router.refresh();
  }

  return (
    <section className="max-w-xl">
      <h1 className="text-3xl font-bold text-emerald-700">Edit Recipe</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-md border border-gray-300 bg-white p-2"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-md border border-gray-300 bg-white p-2"
          rows={5}
        />

        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Update Recipe
        </button>
      </form>
    </section>
  );
}
