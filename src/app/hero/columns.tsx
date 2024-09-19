/* eslint-disable @next/next/no-img-element */
"use client";

import { ColumnDef } from "@tanstack/react-table";

export type DateIso = `${YFirst}${Digit}${Digit}-${MM}-${DD}`;

type YFirst = "19" | "20"; // change this if you accept dates outside of 19xx & 20xx years
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type MM =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";
type DD =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30"
  | "31";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Hero = {
  active: boolean;
  className: "Hero";
  createdAt: DateIso;
  image: string;
  image_mobile: string;
  label: string;
  link: string;
  objectId: string;
  updatedAt: DateIso;
};

export const columns: ColumnDef<Hero>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "link",
    header: "Link",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <img
          src={row.getValue("image")}
          alt="image"
          className="max-h-32 object-cover "
        />
      );
    },
    //   return <img src={row.getValue(")} />
  },
  {
    accessorKey: "image_mobile",
    header: "Image Mobile",
    cell: ({ row }) => {
      return (
        <img
          src={row.getValue("image_mobile")}
          alt="image"
          className="max-h-32 object-cover "
        />
      );
    },
  },
];
