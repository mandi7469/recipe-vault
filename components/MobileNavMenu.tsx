"use client";

import Link from "next/link";
import { useState } from "react";
import LogoutButton from "@/components/LogoutButton";

type MobileNavMenuProps = {
  isAuthenticated: boolean;
  userName: string | null;
};

export default function MobileNavMenu({
  isAuthenticated,
  userName,
}: MobileNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
        className="flex items-center rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50"
      >
        <span className="sr-only">Toggle navigation menu</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {isOpen && (
        <div
          id="mobile-nav-menu"
          className="absolute right-0 top-12 z-20 w-72 rounded-lg border border-emerald-100 bg-white p-4 shadow-lg"
        >
          <div className="flex flex-col gap-3 text-sm font-medium text-gray-700">
            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-md px-2 py-1 hover:bg-emerald-50"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/recipes"
                  onClick={closeMenu}
                  className="rounded-md px-2 py-1 hover:bg-emerald-50"
                >
                  Recipes
                </Link>
                <Link
                  href="/my-recipes"
                  onClick={closeMenu}
                  className="rounded-md px-2 py-1 hover:bg-emerald-50"
                >
                  My Recipes
                </Link>
                <Link
                  href="/recipes/new"
                  onClick={closeMenu}
                  className="rounded-md bg-emerald-600 px-3 py-2 text-center text-white hover:bg-emerald-700"
                >
                  Add Recipe
                </Link>
                <span className="px-2 text-gray-600">
                  Hi, {userName ?? "Chef"}
                </span>
                <div onClick={closeMenu}>
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/recipes"
                  onClick={closeMenu}
                  className="rounded-md px-2 py-1 hover:bg-emerald-50"
                >
                  Recipes
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="rounded-md px-2 py-1 hover:bg-emerald-50"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="rounded-md bg-emerald-600 px-3 py-2 text-center text-white hover:bg-emerald-700"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
