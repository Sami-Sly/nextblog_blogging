import { getAllPosts } from "@/app/actions/posts";
import { DataTable } from "@/components/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns } from "./client/columns";

import { requireAdmin } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  await requireAdmin();
  const data = await getAllPosts();


  if (!data) {
    redirect("/sign-in"); // redirect if no session
  }


  return (
    <>
      <div className="flex flex-col p-8">
        <div className="flex w-full justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>posts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Link href="/posts/new">
            <Button className="cursor-pointer">Create new post</Button>
          </Link>
        </div>
      </div>

      <DataTable data={data} columns={columns} />
    </>
  );
}