import { getCategories } from "@/app/actions/categories";
import CategoriesClien from "./client/categories-client";
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const data = await getCategories();

  return (
    <div>
      <CategoriesClien categories={data!} />
    </div>
  );
}