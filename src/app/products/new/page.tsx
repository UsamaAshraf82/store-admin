"use client";

import { upload_cloudinary } from "@/backend/cloudinary";
import ImageUploadMultiple from "@/components/custom/image-upload-multiple";
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

// category: categoryTypeDB;
// className: "Product";
// description: string;

// img: string[];
// name: string;
// price: number;
// quantity: number;
// sku: string;

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be Defined.",
  }),
  description: z.string().min(1, {
    message: "Description must be Defined.",
  }),
  sku: z.string(),
  price: z
    .number({ coerce: true })
    .min(1, { message: "Price must be 1 or Greator" }),
  quantity: z
    .number({ coerce: true })
    .min(0, { message: "Price must be 0 or Greator" }),
  discount: z.number({ coerce: true }).nullable(),
  discount_End_Date: z.string().nullable(),
  img: z.array(z.instanceof(File)),
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
    const upload: string[] = [];
    for (let index = 0; index < values.img.length; index++) {
      const element = values.img[index];
      const image = await upload_cloudinary({ file: element });
      upload.push(image.secure_url);
    }
    // const image_mobile = await upload_cloudinary({ file: values.mobile_image });
    const myNewObject = new Parse.Object("Product");
    myNewObject.set("img", upload);
    myNewObject.set("name", values.name);
    myNewObject.set("description", values.description);
    myNewObject.set("discount", parseInt(values.discount + ""));
    myNewObject.set("discount_End_Date", values.discount_End_Date);
    myNewObject.set("active", true);
    myNewObject.set("sku", values.sku);
    myNewObject.set("price", values.price);
    myNewObject.set("quantity", values.quantity);
    await myNewObject.save();
    router.push("/product");
  }

  return (
    <main className=" flex-1 items-start  p-4 sm:px-6 sm:py-0 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col md:gap-4 gap-4 "
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel>Name</FormLabel>
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
              <FormItem className="w-1/3">
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
            name="sku"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem className="w-1/3">
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
              <FormItem className="w-1/3">
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
            name="price"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel>Price</FormLabel>
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
          />{" "}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel>Quantity</FormLabel>
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
            name="img"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUploadMultiple
                    file={field.value}
                    // cropAspect={1120 / 400}
                    onupdatefiles={(e) => {
                      form.setValue("img", e);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-1/3" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}
