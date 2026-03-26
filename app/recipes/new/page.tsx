import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewRecipeForm from "@/components/NewRecipeForm";

export default async function NewRecipePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/recipes/new");
  }

  return <NewRecipeForm />;
}
