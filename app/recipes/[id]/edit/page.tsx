"use client";

import Link from "next/link";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipe() {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);

        const res = await fetch(`/api/recipes/${resolvedParams.id}`);

        if (!res.ok) {
          throw new Error("Failed to load recipe");
        }

        const recipe = await res.json();

        setTitle(recipe.title || "");
        setDescription(recipe.description || "");
      } catch (err) {
        setError("Unable to load recipe.");
      } finally {
        setIsLoading(false);
      }
    }

    loadRecipe();
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Recipe title is required.");
      return;
    }

    try {
      setIsSaving(true);

      const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update recipe");
      }

      router.push(`/recipes/${id}`);
      router.refresh();
    } catch (err) {
      setError("Something went wrong while updating the recipe.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-gray-600">Loading recipe...</p>;
  }

  return (
    <section className="max-w-xl">
      <h1 className="text-3xl font-bold text-emerald-700">Edit Recipe</h1>
      <p className="mt-2 text-gray-600">Update your recipe details below.</p>

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
            {isSaving ? "Updating..." : "Update Recipe"}
          </button>

          <Link
            href={`/recipes/${id}`}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
