import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { auth } from "@/auth";

// GET all recipes with search, filter, sort, and pagination
export async function GET(req: Request) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "5");

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

  const skip = (page - 1) * limit;

  const [recipes, total] = await Promise.all([
    Recipe.find(query).sort(sortOption).skip(skip).limit(limit),
    Recipe.countDocuments(query),
  ]);

  return NextResponse.json({
    recipes,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST create a new recipe (requires authentication)
export async function POST(req: Request) {
  await connectToDatabase();

  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in to create a recipe." },
      { status: 401 },
    );
  }

  const data = await req.json();

  const newRecipe = await Recipe.create({
    ...data,
    userId: session.user.id,
  });

  return NextResponse.json(newRecipe, { status: 201 });
}
