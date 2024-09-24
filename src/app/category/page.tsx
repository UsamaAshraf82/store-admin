"use client";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Parse from "parse";
import { columns } from "./columns";
import { categoryTypeDB } from "./schema";
export default function Dashboard() {
  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: async ({ signal, pageParam }) => {
      const query = new Parse.Query("Category");

      const result = await query.find({ json: true });

      return result as categoryTypeDB[];
    },
    initialData: [],
  });

  return (
    <main className="grid px-4 gap-2 ">
      <Button asChild className="w-32">
        <Link href="/category/new">New Category</Link>
      </Button>
      <DataTable columns={columns} data={data} />
    </main>
  );
}
