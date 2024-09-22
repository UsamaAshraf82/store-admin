"use client";
import { upload_cloudinary } from "@/backend/cloudinary";
import ImageUpload from "@/components/custom/image-upload";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Parse from "parse";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  label: z.string().min(1, {
    message: "Label must be Defined.",
  }),
  description: z.string().min(1, {
    message: "Description must be Defined.",
  }),
  discount: z.number({ coerce: true }).nullable(),
  discount_End_Date: z.string().nullable(),
  mobile_image: z.instanceof(File),
  image: z.instanceof(File),
});

export default function Dashboard() {
  // 1. Define your form.
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   link: "",
    // },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const image = await upload_cloudinary({ file: values.image });
    const image_mobile = await upload_cloudinary({ file: values.mobile_image });
    const myNewObject = new Parse.Object("Category");
    myNewObject.set("image", image.secure_url);
    myNewObject.set("image_mobile", image_mobile.secure_url);
    myNewObject.set("label", values.label);
    myNewObject.set("description", values.description);
    myNewObject.set("discount", parseInt(values.discount + ""));
    myNewObject.set("discount_End_Date", values.discount_End_Date);
    myNewObject.set("active", true);
    await myNewObject.save();
    router.push("/category");
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value === null ? undefined : field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount_End_Date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount End Date</FormLabel>
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
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    file={field.value}
                    cropAspect={1120 / 400}
                    onupdatefiles={(e) => {
                      // if (e) {
                      form.setValue("image", e);
                      // }
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    file={field.value}
                    cropAspect={311 / 304}
                    onupdatefiles={(e) => {
                      // if (e) {
                      form.setValue("mobile_image", e);
                      // }
                    }}
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
