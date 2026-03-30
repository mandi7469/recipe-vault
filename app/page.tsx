import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col gap-8">
      <div className="max-w-2xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-600">
          Welcome to Recipe Vault
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Organize your favorite recipes in one clean place.
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Save family recipes, plan future meals, and keep your kitchen ideas
          organized.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/recipes"
          className="w-full rounded-md bg-emerald-600 px-5 py-3 text-center text-white hover:bg-emerald-700 sm:w-auto"
        >
          Browse Recipes
        </Link>
        <Link
          href="/recipes/new"
          className="w-full rounded-md border border-emerald-600 px-5 py-3 text-center text-emerald-600 hover:bg-emerald-100 sm:w-auto"
        >
          Add Your First Recipe
        </Link>
      </div>
    </section>
  );
}
