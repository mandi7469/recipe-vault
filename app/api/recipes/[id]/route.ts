import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

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
