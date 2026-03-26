import Link from "next/link";

// Navbar component for the application
export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-emerald-600">
          Recipe Vault
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-emerald-600">
            Home
          </Link>
          <Link href="/recipes" className="hover:text-emerald-600">
            Recipes
          </Link>
          <Link href="/signup" className="hover:text-emerald-600">
            Sign Up
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Log In
          </Link>
        </div>
      </nav>
    </header>
  );
}
