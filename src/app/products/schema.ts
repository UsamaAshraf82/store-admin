import { DBType } from "@/type/type";

export type categoryType = {
  label: string;
  description: string;
  discount: number;
  discount_End_Date: string;
  image_mobile: string;
  image: string;
  active: boolean;
};

export type categoryTypeDB = categoryType & DBType;
