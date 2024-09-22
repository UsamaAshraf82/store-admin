"use server";
import { SettingSchema } from "@/app/settings/page";
import ParseInitServer from "@/helper/parseiniserver";
import { z } from "zod";

export async function saveSettings(values: z.infer<typeof SettingSchema>) {
  const Parse = await ParseInitServer();
  await Parse.Config.save(values);
}
