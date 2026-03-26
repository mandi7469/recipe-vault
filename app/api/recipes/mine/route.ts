import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

export async function GET() {
  await connectToDatabase();

  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in to view your recipes." },
      { status: 401 },
    );
  }

  const recipes = await Recipe.find({ userId: session.user.id }).sort({
    createdAt: -1,
  });

  return NextResponse.json(recipes);
}
