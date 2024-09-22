"use client";
import { saveSettings } from "@/actions/server";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Parse from "parse";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SettingSchema = z.object({
  Global_Discount: z.number({ coerce: true }).min(0, {
    message: "Label must be Defined.",
  }),
  Global_Discount_End_Date: z.string(),
});

export default function Dashboard() {
  const { data, refetch } = useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const constants = await Parse.Config.get();

      return constants.attributes;
    },
    initialData: {},
  });

  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    values: data,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SettingSchema>) {
    await saveSettings({
      ...values,
      Global_Discount_End_Date: values.Global_Discount_End_Date
        ? new Date(values.Global_Discount_End_Date).toISOString()
        : "",
    });
    refetch();
  }

  return (
    <main className="grid px-4 gap-2 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="Global_Discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Global Discount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Global_Discount_End_Date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Global Discount End Date</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().substring(0, 16)
                        : ""
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
}
