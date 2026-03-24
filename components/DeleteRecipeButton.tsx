"use client";

export default function DeleteRecipeButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        const confirmed = window.confirm(
          "Are you sure you want to delete this recipe?",
        );

        if (!confirmed) {
          e.preventDefault();
        }
      }}
      className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
      Delete
    </button>
  );
}
