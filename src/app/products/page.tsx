"use client";
import { DataTable } from "@/components/custom/data-table";
import { LoadingSpinner } from "@/components/custom/loader-spinner";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import flatten from "lodash/flatten";
import Link from "next/link";
import Parse from "parse";
import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { columns } from "./columns";
import { productTypeDB } from "./schema";

const limit = 50;
export default function Dashboard() {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["product"],
      queryFn: async ({ signal, pageParam }) => {
        const skip = pageParam * limit;

        const query = new Parse.Query("Product");
        query.limit(limit);
        query.skip(skip);

        query.include("category");

        const result = await query.find({ json: true });

        console.log(result);

        return result as productTypeDB[];
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.length < limit) {
          return undefined;
        }

        if (lastPageParam >= 10) {
          return undefined;
        }
        return lastPageParam + 1;
      },
    });

  useEffect(() => {
    if (isFetching) {
      return;
    }
    if (isFetchingNextPage) {
      return;
    }
    if (!hasNextPage) {
      return;
    }
    if (isIntersecting) {
      fetchNextPage({ cancelRefetch: false });
    }
  }, [
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isIntersecting,
  ]);

  return (
    <main className="grid px-4 gap-2 ">
      <Button asChild className="w-32">
        <Link href="/products/new">New Product</Link>
      </Button>
      <DataTable columns={columns} data={flatten(data?.pages)} />
      {hasNextPage && (
        <div
          ref={ref}
          className="my-5 flex items-center justify-center text-center text-5xl"
        >
          <LoadingSpinner />
        </div>
      )}
    </main>
  );
}
