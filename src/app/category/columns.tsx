/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import Link from "next/link";
import Parse from "parse";
import { categoryTypeDB } from "./schema";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const columnHelper = createColumnHelper<categoryTypeDB>();

export const columns = [
  columnHelper.accessor("label", {
    id: "label",
    header: () => <span>Label</span>,
  }),
  columnHelper.accessor("description", {
    id: "link",
    header: () => <span>Link</span>,
  }),
  columnHelper.accessor("discount", {
    id: "discount",
    header: () => <span>Discount</span>,
  }),
  columnHelper.accessor("discount_End_Date", {
    id: "discount_End_Date",
    header: () => <span>Discount End Date</span>,
    cell: ({ renderValue }) => {
      const value = renderValue();
      if (!value) return "";
      return new Date(value).toDateString();
    },
  }),
  columnHelper.accessor("image", {
    id: "Image",
    header: () => <span>Image</span>,
    cell: ({ renderValue }) => {
      return (
        <img
          src={renderValue() || ""}
          alt="image"
          className="max-h-32 object-cover "
        />
      );
    },
  }),
  columnHelper.accessor("image_mobile", {
    id: "image_mobile",
    header: () => <span>Image Mobile</span>,
    cell: ({ renderValue }) => {
      return (
        <img
          src={renderValue() || ""}
          alt="image"
          className="max-h-32 object-cover "
        />
      );
    },
  }),
  columnHelper.accessor("active", {
    id: "Active",
    header: () => <span>Active</span>,
    cell: ({ renderValue, getValue, row }) => {
      return (
        <Switch
          defaultChecked={renderValue() || false}
          onCheckedChange={async (e) => {
            console.log(getValue());
            const query = new Parse.Query("Hero");
            try {
              const object = await query.get(row.original.objectId);
              object.set("active", e);
              await object.save();
            } catch (e) {
              console.log(e);
            }
          }}
        />
      );
    },
  }),
  columnHelper.accessor((row) => row, {
    id: "Actions",
    header: () => <span>Actions</span>,
    cell: ({ row, getValue }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const queryClient = useQueryClient();
      return (
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href={"/category/edit/" + row.original.objectId}>Edit</Link>
          </Button>
          <Button
            onClick={async () => {
              const query = new Parse.Query("Category");
              try {
                const object = await query.get(row.original.objectId);
                await object.destroy();
                queryClient.invalidateQueries({ queryKey: ["category"] });
              } catch (e) {
                console.log(e);
              }
            }}
          >
            Delete
          </Button>
        </div>
      );
    },
  }),
];
