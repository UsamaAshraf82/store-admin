"use server";
import ParseInitServer from "@/helper/parseiniserver";

export async function saveSettings(values: {
  Global_Discount: number;
  Global_Discount_End_Date: string;
}) {
  const Parse = await ParseInitServer();
  await Parse.Config.save(values);
}
