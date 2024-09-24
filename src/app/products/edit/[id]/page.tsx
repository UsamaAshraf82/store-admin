"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { categoryTypeDB } from "@/app/category/schema";
import { upload_cloudinary } from "@/backend/cloudinary";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Parse from "parse";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { productTypeDB } from "../../schema";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be Defined.",
  }),
  description: z.string().min(1, {
    message: "Description must be Defined.",
  }),
  sku: z.string(),
  category: z.string(),
  price: z
    .number({ coerce: true })
    .min(1, { message: "Price must be 1 or Greator" }),
  quantity: z
    .number({ coerce: true })
    .min(0, { message: "Price must be 0 or Greator" }),
  discount: z.number({ coerce: true }).nullable(),
  discount_End_Date: z.string().nullable(),

  img: z.array(
    z.object({ file: z.instanceof(File).nullable(), url: z.string() })
  ),
});

export default function Dashboard({
  params,
}: {
  params: { id: string };
  searchParams: {};
}) {
  console.log(params);
  const { data: product } = useQuery({
    queryKey: ["product", params.id],
    queryFn: async ({}) => {
      const query = new Parse.Query("Product");
      query.include("category");
      const result = await query.get(params.id, { json: true });

      return result as productTypeDB;
    },
  });

  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: async ({}) => {
      const query = new Parse.Query("Category");

      const result = await query.find({ json: true });

      return result as categoryTypeDB[];
    },
    initialData: [],
  });

  // 1. Define your form.
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: product
      ? {
          name: product.name,
          description: product.description,
          sku: product.sku,
          category: product.category.objectId,
          price: product.price,
          quantity: product.quantity,
          discount: product.discount,
          discount_End_Date: product.discount_End_Date,
          img: product.img.map((i) => ({ file: null, url: i })),
        }
      : undefined,
    // defaultValues: {
    //   link: "",
    // },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const upload: string[] = [];
    for (let index = 0; index < values.img.length; index++) {
      const element = values.img[index];
      if (element.file) {
        const image = await upload_cloudinary({ file: element.file });
        upload.push(image.secure_url);
      } else {
        upload.push(element.url);
      }
    }

    const query = new Parse.Query("Product");
    const myNewObject = await query.get(params.id);

    myNewObject.set("img", upload);
    myNewObject.set("name", values.name);
    myNewObject.set("category", {
      __type: "Pointer",
      className: "Category",
      objectId: values.category,
    });
    myNewObject.set("description", values.description);
    myNewObject.set("discount", parseInt(values.discount + ""));
    myNewObject.set("discount_End_Date", values.discount_End_Date);
    myNewObject.set("active", true);
    myNewObject.set("sku", values.sku);
    myNewObject.set("price", values.price);
    myNewObject.set("quantity", values.quantity);
    await myNewObject.save();
    router.push("/products");
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
            name="category"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data.map((d) => (
                      <SelectItem value={d.objectId} key={d.objectId}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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
