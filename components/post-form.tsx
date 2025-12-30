"use client";

import { createPost, updatePost } from "@/app/actions/posts";
import { generateSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { object, z } from "zod";
import ImageUploader from "./image-uploader";
import RichTextEditor from "./toolbars/editor";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Spinner } from "./ui/spinner";

const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: "Title is required" }),
  slug: z.string().min(3, { message: "Slug is required" }),
  content: z.string().min(3, { message: "Content is required" }),
  imageUrl: z.string({ message: "Image URL is required" }),
  imageAlt: z.string().optional(),
  categoryId: z.string(),
  tags: z.array(z.object({ label: z.string(), value: z.string() })),
  categories: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  status: z.string(),
  
  // SEO / Metadata
  seoTitle: z.string(),
  seoDescription: z.string(),
  canonicalUrl: z.string(),
  primaryKeyword: z.string(),

  // Social media / OG
  ogImage: z.string(),    
  // twitterImage: z.string().optional(),
  // featuredImage: z.string().optional(),
  dateModified: z.date().optional(),
  datePublished: z.date().optional(),

  // Structured Data
  author: z.string().optional(),
  readingTime: z.number().optional(),
  noIndex: z.boolean().optional(),
});



export type PostFormValues = z.infer<typeof formSchema>;

export default function PostForm({
  id,
  title,
  content,
  imageUrl,
  categoryId,
  tags,
  status,
  categories,
  slug,
  imageAlt,
  seoTitle,
  seoDescription,
  canonicalUrl,
  primaryKeyword,
  ogImage,
  author,
  readingTime,
  noIndex,  
  dateModified,
  datePublished,
}: PostFormValues) {
  const router = useRouter();
 const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    id,
    title,
    slug,
    content,
    imageUrl,
    imageAlt,
    categoryId,
    categories,
    status,
    tags,
    seoTitle,
    seoDescription,
    canonicalUrl,
    primaryKeyword,
    ogImage,
    author,
    readingTime,
    noIndex,
    dateModified,
    datePublished,

  },
  mode: "onBlur",
});

  const onSubmit = async (data: PostFormValues) => {
    if (id) {
      await updatePost(data);
      toast.success("Post updated successfully");
    } else {
      await createPost(data);
      toast.success("Post created successfully");
    }

    router.refresh();
    router.push("/posts");
  };

  return (

    <Form {...form}>
  <form
    className="grid grid-cols-2 gap-6"
    onSubmit={form.handleSubmit(onSubmit)}
  >
    <div className="flex flex-col gap-6 py-6">
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                {...field}
                onBlur={(e) => {
                  field.onBlur();
                  if (!form.getValues("slug")) {
                    form.setValue("slug", generateSlug(e.target.value), {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Slug */}
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Image URL */}
      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
              <ImageUploader
                endpoint="imageUploader"
                defaultUrl={field.value || null}
                onChange={(url) => field.onChange(url)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Image Alt */}
      <FormField
        control={form.control}
        name="imageAlt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image Alt Text</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Description for accessibility" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Content */}
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <RichTextEditor content={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tags */}
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <CreatableSelect
                isMulti
                isClearable
                {...field}
                onCreateOption={(value) => {
                  const newOption = { label: value, value: value.toLowerCase() };
                  field.onChange([...field.value, newOption]);
                }}
                components={{ IndicatorsContainer: () => null }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SEO Fields */}
      <FormField
        control={form.control}
        name="seoTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SEO Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="seoDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SEO Description</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="canonicalUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Canonical URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://example.com/post" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="primaryKeyword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Keyword</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* OG Image */}
      <FormField
        control={form.control}
        name="ogImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>OG Image</FormLabel>
            <FormControl>
              <ImageUploader
                endpoint="imageUploader"
                defaultUrl={field.value || null}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Author */}
      <FormField
        control={form.control}
        name="author"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Author Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Reading Time */}
      <FormField
        control={form.control}
        name="readingTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reading Time (minutes)</FormLabel>
            <FormControl>
              <Input type="number" {...field} min={0} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* NoIndex */}
<FormField
  control={form.control}
  name="noIndex"
  render={({ field }) => (
    <FormItem className="flex items-center gap-2">
      <FormLabel>No Index (SEO)</FormLabel>
      <FormControl>
        <input
          type="checkbox"
          checked={field.value ?? false} // ✅ use checked for booleans
          onChange={(e) => field.onChange(e.target.checked)} // pass boolean
          onBlur={field.onBlur}
          className="h-4 w-4"
        />
      </FormControl>
    </FormItem>
  )}
/>

    </div>

    <div className="flex flex-col gap-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Extra Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Category */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={categoryId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={status}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["published", "draft"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>

    <Button
      type="submit"
      className="max-w-40 cursor-pointer"
      disabled={!form.formState.isValid || form.formState.isSubmitting}
    >
      {form.formState.isSubmitting ? <Spinner className="size-6" /> : "Save changes"}
    </Button>
  </form>
</Form>
//     <Form {...form}>
//       <form
//         className="grid grid-cols-2 gap-6"
//         onSubmit={form.handleSubmit(onSubmit)}
//       >
//         <div className="flex flex-col gap-6 py-6">
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Title</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     onBlur={(e) => {
//                       field.onBlur();

//                       if (!form.getValues("slug")) {
//                         form.setValue("slug", generateSlug(e.target.value), {
//                           shouldValidate: true,
//                           shouldDirty: true,
//                         });
//                       }
//                     }}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="slug"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Slug</FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}


// />



// <FormField
//   control={form.control}
//   name="imageUrl"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Image</FormLabel>
//       <FormControl>
//         <ImageUploader
//           endpoint="imageUploader"
//           defaultUrl={field.value || null}
//           onChange={(url) => {
//             field.onChange(url); // ✅ Pass `null` directly — NOT `url ?? ""`
//           }}
//         />
//       </FormControl>
//       <FormMessage />
//     </FormItem>
//   )}
// />

//           <FormField
//             control={form.control}
//             name="content"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Content</FormLabel>
//                 <FormControl>
//                   <RichTextEditor
//                     content={field.value}
//                     onChange={field.onChange}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="tags"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Tags</FormLabel>
//                 <FormControl>
//                   <CreatableSelect
//                     isMulti
//                     isClearable
//                     {...field}
//                     onCreateOption={(value) => {
//                       const newOption = {
//                         label: value,
//                         value: value.toLocaleLowerCase(),
//                       };
//                       field.onChange([...field.value, newOption]);
//                     }}
//                     components={{ IndicatorsContainer: () => null }}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="flex flex-col gap-6">
//           <Card className="w-full max-w-sm">
//             <CardHeader>
//               <CardTitle>Extra Settins</CardTitle>
//             </CardHeader>
//             <CardContent className="flex flex-col gap-6">
//               <FormField
//                 control={form.control}
//                 name="categoryId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Category</FormLabel>
//                     <FormControl>
//                       <Select
//                         {...field}
//                         onValueChange={field.onChange}
//                         defaultValue={categoryId}
//                       >
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Category" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {categories?.map((category) => (
//                             <SelectItem key={category.id} value={category.id}>
//                               {category.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="status"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Status</FormLabel>
//                     <FormControl>
//                       <Select
//                         {...field}
//                         onValueChange={field.onChange}
//                         defaultValue={status}
//                       >
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Status" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {["published", "draft"].map((status) => (
//                             <SelectItem key={status} value={status}>
//                               {status}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </CardContent>
//           </Card>
//         </div>

//         <Button
//           type="submit"
//           className="max-w-40 cursor-pointer"
//           disabled={!form.formState.isValid || form.formState.isSubmitting}
//         >
//           {form.formState.isSubmitting ? (
//             <Spinner className="size-6" />
//           ) : (
//             "Save changes"
//           )}
//         </Button>
//       </form>
//     </Form>
  );
}
