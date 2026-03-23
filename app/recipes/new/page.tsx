"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/recipes", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        ingredients: [],
        instructions: [],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    router.push("/recipes");
  }

  return (
    <section>
      <h1 className="text-3xl font-bold">Add New Recipe</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4 max-w-md"
      >
        <input
          type="text"
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-md border p-2"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-md border p-2"
        />

        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Save Recipe
        </button>
      </form>
    </section>
  );
}
