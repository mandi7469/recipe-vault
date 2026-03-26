import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { auth } from "@/auth";

// GET all recipes with search, filter, sort, and pagination
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectToDatabase();
  const { id } = await params;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(recipe);
}

// PUT update a recipe
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectToDatabase();

  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in to update a recipe." },
      { status: 401 },
    );
  }

  const { id } = await params;
  const data = await req.json();

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (recipe.userId?.toString() !== session.user.id) {
    return NextResponse.json(
      { error: "You are not allowed to edit this recipe." },
      { status: 403 },
    );
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(id, data, {
    new: true,
  });

  return NextResponse.json(updatedRecipe);
}

// DELETE a recipe
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectToDatabase();

  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in to delete a recipe." },
      { status: 401 },
    );
  }

  const { id } = await params;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (recipe.userId?.toString() !== session.user.id) {
    return NextResponse.json(
      { error: "You are not allowed to delete this recipe." },
      { status: 403 },
    );
  }

  await Recipe.findByIdAndDelete(id);

  return NextResponse.json({ message: "Recipe deleted" });
}
