import { getCategories } from "@/app/actions/categories";
import CategoriesClien from "./client/categories-client";
import { requireAdmin } from "@/lib/auth-utils";
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  await requireAdmin();
  const data = await getCategories();

  return (
    <div>
      <CategoriesClien categories={data!} />
    </div>
  );
}