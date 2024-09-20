/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import Parse from "parse";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Hero = {
  active: boolean;
  className: "Hero";
  createdAt: string;
  image: string;
  image_mobile: string;
  label: string;
  link: string;
  objectId: string;
  updatedAt: string;
};

const columnHelper = createColumnHelper<Hero>();

export const columns = [
  columnHelper.accessor("label", {
    id: "label",
    header: () => <span>Label</span>,
  }),
  columnHelper.accessor("link", {
    id: "link",
    header: () => <span>Link</span>,
  }),
  columnHelper.accessor("image", {
    id: "Image",
    header: () => <span>Link</span>,
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
    cell: ({ renderValue, getValue, row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const queryClient = useQueryClient();
      return (
        <Button
          onClick={async () => {
            const query = new Parse.Query("Hero");
            try {
              const object = await query.get(row.original.objectId);
              await object.destroy();
              queryClient.invalidateQueries({ queryKey: ["hero"] });
            } catch (e) {
              console.log(e);
            }
          }}
        >
          Delete
        </Button>
      );
    },
  }),
];
