import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

// GET all recipes
export async function GET() {
  await connectToDatabase();

  const recipes = await Recipe.find().sort({ createdAt: -1 });

  return NextResponse.json(recipes);
}

// POST new recipe
export async function POST(req: Request) {
  await connectToDatabase();

  const data = await req.json();

  const newRecipe = await Recipe.create(data);

  return NextResponse.json(newRecipe, { status: 201 });
}
