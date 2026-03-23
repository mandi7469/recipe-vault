import Link from "next/link";

// Navbar component for the application
export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-orange-600">
          Recipe Vault
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-orange-600">
            Home
          </Link>
          <Link href="/recipes" className="hover:text-orange-600">
            Recipes
          </Link>
          <Link
            href="/recipes/new"
            className="rounded-md bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
          >
            Add Recipe
          </Link>
        </div>
      </nav>
    </header>
  );
}
