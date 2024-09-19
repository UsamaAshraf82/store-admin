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
import { columns, Hero } from "./columns";
const limit = 50;
export default function Dashboard() {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  const {
    data,
    fetchNextPage,
    // refetch,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["latest-images"],
    queryFn: async ({ signal, pageParam }) => {
      const skip = pageParam * limit;

      const query = new Parse.Query("Hero");
      query.limit(limit);
      query.skip(skip);

      const result = await query.find({ json: true });
      console.log(result);
      return result as Hero[];
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
      <Button asChild className="w-20">
        <Link href="/hero/new">New Hero</Link>
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
