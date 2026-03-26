import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import EditRecipeForm from "@/components/EditRecipeForm";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    const { id } = await params;
    redirect(`/login?callbackUrl=/recipes/${id}/edit`);
  }

  await connectToDatabase();
  const { id } = await params;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    redirect("/recipes");
  }

  if (recipe.userId?.toString() !== session.user.id) {
    redirect(`/recipes/${id}`);
  }

  return <EditRecipeForm params={Promise.resolve({ id })} />;
}
