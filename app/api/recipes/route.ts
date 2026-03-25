import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

// GET all recipes with optional search, filter, and sort
export async function GET(req: Request) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const sort = searchParams.get("sort") || "newest";

  const query: any = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = { $regex: `^${category}$`, $options: "i" };
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  let sortOption: any = { createdAt: -1 };

  if (sort === "prepTime") {
    sortOption = { prepTime: 1 };
  }

  if (sort === "cookTime") {
    sortOption = { cookTime: 1 };
  }

  const recipes = await Recipe.find(query).sort(sortOption);

  return NextResponse.json(recipes);
}

// POST new recipe
export async function POST(req: Request) {
  await connectToDatabase();

  const data = await req.json();

  const newRecipe = await Recipe.create(data);

  return NextResponse.json(newRecipe, { status: 201 });
}
