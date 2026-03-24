"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewRecipePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Recipe title is required.");
      return;
    }

    try {
      setIsSaving(true);

      const res = await fetch("/api/recipes", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          ingredients: [],
          instructions: [],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to create recipe");
      }

      router.push("/recipes");
      router.refresh();
    } catch (err) {
      setError("Something went wrong while saving the recipe.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="max-w-xl">
      <h1 className="text-3xl font-bold text-emerald-700">Add New Recipe</h1>
      <p className="mt-2 text-gray-600">
        Create a new recipe to save in your collection.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Recipe Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Ex: Creamy Garlic Pasta"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-2"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Briefly describe the recipe"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-2"
            rows={5}
          />
        </div>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Recipe"}
          </button>

          <Link
            href="/recipes"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
