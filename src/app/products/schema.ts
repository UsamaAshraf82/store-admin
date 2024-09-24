import { DBType } from "@/type/type";
import { categoryTypeDB } from "../category/schema";

export type productType = {
  active: boolean;
  category: categoryTypeDB;
  className: "Product";
  description: string;

  img: string[];
  name: string;
  price: number;
  quantity: number;
  sku: string;
  discount_End_Date: string;
  discount: number;
};

export type productTypeDB = productType & DBType;
