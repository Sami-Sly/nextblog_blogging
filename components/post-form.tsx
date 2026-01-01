
"use client";

import { createPost, updatePost } from "@/app/actions/posts";
import { generateSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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


// ===== ZOD SCHEMA =====
export const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(3),
  imageUrl: z.string(),
  imageAlt: z.string().optional(),
  categoryId: z.string(),
  tags: z.array(z.object({ label: z.string(), value: z.string() })),
  categories: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  status: z.string(),

  // SEO
  seoTitle: z.string(),
  seoDescription: z.string(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  primaryKeyword: z.string().optional(),
  ogImage: z.string().optional(),

  // Author & Dates
  author: z.string().optional(),
  authorCredentials: z.string().optional(),
  authorProfileUrl: z.string().url().optional().or(z.literal("")),
  authorExperienceYrs: z.coerce.number().min(0).optional(),
  datePublished: z.date().optional(),
  dateModified: z.date().optional(),
  readingTime: z.coerce.number().min(0).optional(),

  // Medical Review
  reviewedBy: z.string().optional(),
  reviewerCredentials: z.string().optional(),
  medicalReviewDate: z.date().optional(),

  // Medical Entity Graph
  mainEntity: z.string().optional(),
  medicalSpecialty: z.string().optional(),
  medicalConditions: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  symptoms: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  treatments: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  medications: z.array(z.object({ label: z.string(), value: z.string() })).optional(),

  // Freshness
  lastMedicalUpdate: z.date().optional(),
  contentVersion: z.string().optional(),

  // Intent & Trust
  intent: z.string().optional(),
  editorialPolicyUrl: z.string().url().optional().or(z.literal("")),
  medicalBoardUrl: z.string().url().optional().or(z.literal("")),
  hasDisclaimer: z.boolean().optional(),
  riskLevel: z.string().optional(),

  // Publisher
  publisherName: z.string().optional(),
  publisherUrl: z.string().url().optional().or(z.literal("")),
  publisherLogoUrl: z.string().optional(),

  // Citations & Audience
  citations: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  targetAudience: z.string().optional(),

  // SEO Control
  noIndex: z.boolean().optional(),
});

export type PostFormValues = z.infer<typeof formSchema>;

// ===== POST FORM COMPONENT =====
export default function PostForm(props: Partial<PostFormValues>) {
  const router = useRouter();

  const {
    id,
    title,
    slug,
    content,
    imageUrl,
    imageAlt,
    categoryId,
    status,
    tags,
    categories,
    seoTitle,
    seoDescription,
    canonicalUrl,
    primaryKeyword,
    ogImage,
    author,
    authorCredentials,
    authorProfileUrl,
    authorExperienceYrs,
    datePublished,
    dateModified,
    readingTime,
    reviewedBy,
    reviewerCredentials,
    medicalReviewDate,
    mainEntity,
    medicalSpecialty,
    medicalConditions,
    symptoms,
    treatments,
    medications,
    lastMedicalUpdate,
    contentVersion,
    intent,
    editorialPolicyUrl,
    medicalBoardUrl,
    hasDisclaimer,
    riskLevel,
    publisherName,
    publisherUrl,
    publisherLogoUrl,
    citations,
    targetAudience,
    noIndex,
  } = props;

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      // Required
      title: title ?? "",
      slug: slug ?? "",
      content: content ?? "",
      imageUrl: imageUrl ?? "",
      categoryId: categoryId ?? "",
      status: status ?? "draft",
      seoTitle: seoTitle ?? "",
      seoDescription: seoDescription ?? "",
      tags: tags ?? [],

      // Optional
      id: id ?? undefined,
      imageAlt: imageAlt ?? undefined,
      categories: categories ?? [],
      canonicalUrl: canonicalUrl ?? "",
      primaryKeyword: primaryKeyword ?? undefined,
      ogImage: ogImage ?? undefined,
      author: author ?? undefined,
      authorCredentials: authorCredentials ?? undefined,
      authorProfileUrl: authorProfileUrl ?? undefined,
      authorExperienceYrs: authorExperienceYrs ?? undefined,
      datePublished: datePublished ?? undefined,
      dateModified: dateModified ?? undefined,
      readingTime: readingTime ?? undefined,
      reviewedBy: reviewedBy ?? undefined,
      reviewerCredentials: reviewerCredentials ?? undefined,
      medicalReviewDate: medicalReviewDate ?? undefined,
      mainEntity: mainEntity ?? undefined,
      medicalSpecialty: medicalSpecialty ?? undefined,
      medicalConditions: medicalConditions ?? [],
      symptoms: symptoms ?? [],
      treatments: treatments ?? [],
      medications: medications ?? [],
      lastMedicalUpdate: lastMedicalUpdate ?? undefined,
      contentVersion: contentVersion ?? undefined,
      intent: intent ?? undefined,
      editorialPolicyUrl: editorialPolicyUrl ?? undefined,
      medicalBoardUrl: medicalBoardUrl ?? undefined,
      hasDisclaimer: hasDisclaimer ?? undefined,
      riskLevel: riskLevel ?? undefined,
      publisherName: publisherName ?? undefined,
      publisherUrl: publisherUrl ?? undefined,
      publisherLogoUrl: publisherLogoUrl ?? undefined,
      citations: citations ?? [],
      targetAudience: targetAudience ?? undefined,
      noIndex: noIndex ?? undefined,
    },
    mode: "onBlur",
  });
type BackendPostValues = PostFormValues;
  // Helpers


  const normalizeUrl = (url?: string) => (!url || url.trim() === "" ? undefined : url);
  const normalizeDate = (date?: Date | string) =>
    !date ? undefined : typeof date === "string" ? new Date(date) : date;

  // ===== Submit Handler =====
  const onSubmit = async (data: PostFormValues) => {
    try {
      const normalizedData = {
        ...data,
        authorProfileUrl: normalizeUrl(data.authorProfileUrl),
        editorialPolicyUrl: normalizeUrl(data.editorialPolicyUrl),
        medicalBoardUrl: normalizeUrl(data.medicalBoardUrl),
        publisherUrl: normalizeUrl(data.publisherUrl),

        datePublished: normalizeDate(data.datePublished),
        dateModified: normalizeDate(data.dateModified),
        medicalReviewDate: normalizeDate(data.medicalReviewDate),
        lastMedicalUpdate: normalizeDate(data.lastMedicalUpdate),
      };

      if (data.id) {
        await updatePost(normalizedData);
        toast.success("Post updated successfully");
      } else {
        await createPost(normalizedData);
        toast.success("Post created successfully");
      }

      router.refresh();
      router.push("/posts");
    } catch (error) {
      toast.error("Failed to save post");
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid md:grid-cols-2 grid-cols-1 gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* LEFT COLUMN: Content + SEO */}
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

          {/* Image */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Image</FormLabel>
                <FormControl>
                  <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] lg:aspect-[21/9] overflow-hidden rounded-lg border">
                    <ImageUploader
                      endpoint="imageUploader"
                      defaultUrl={field.value || null}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageAlt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Alt Text</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Describe for accessibility" />
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
                    {...field}
                    onCreateOption={(value) => {
                      const newOption = { label: value, value: value.toLowerCase() };
                      field.onChange([...(field.value || []), newOption]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* === SEO SECTION === */}
          <h2 className="text-xl font-bold pt-4">🔍 SEO Settings</h2>
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

          <FormField
            control={form.control}
            name="ogImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OG Image</FormLabel>
                <FormControl>
                  <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] lg:aspect-[21/9] overflow-hidden rounded-lg border">
                    <ImageUploader
                      endpoint="imageUploader"
                      defaultUrl={field.value || null}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="noIndex"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>No Index</FormLabel>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value ?? false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* RIGHT COLUMN: Medical + Trust + Metadata */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>👨‍⚕️ Author & Review</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorCredentials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Credentials</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., MBBS, FWACS" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorProfileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author LinkedIn / Bio URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://linkedin.com/in/..." />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorExperienceYrs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reviewedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reviewed By</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reviewerCredentials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reviewer Credentials</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., MD, Professor of Dermatology" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalReviewDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Review Date</FormLabel>
                    <FormControl>
                      {/* <Input type="date" {...field} /> */}
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🧠 Medical Entity Graph</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="mainEntity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Medical Condition</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Acne Vulgaris" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalSpecialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Specialty</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Dermatology" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Conditions</FormLabel>
                    <FormControl>
                      <CreatableSelect
                        isMulti
                        {...field}
                        onCreateOption={(value) => {
                          const newOption = { label: value, value };
                          field.onChange([...(field.value || []), newOption]);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <CreatableSelect
                        isMulti
                        {...field}
                        onCreateOption={(value) => {
                          const newOption = { label: value, value };
                          field.onChange([...(field.value || []), newOption]);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="treatments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatments</FormLabel>
                    <FormControl>
                      <CreatableSelect
                        isMulti
                        {...field}
                        onCreateOption={(value) => {
                          const newOption = { label: value, value };
                          field.onChange([...(field.value || []), newOption]);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medications</FormLabel>
                    <FormControl>
                      <CreatableSelect
                        isMulti
                        {...field}
                        onCreateOption={(value) => {
                          const newOption = { label: value, value };
                          field.onChange([...(field.value || []), newOption]);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🛡️ Trust & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="medicalBoardUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Board URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        defaultValue="https://www.mdcn.gov.ng"
                        placeholder="https://www.mdcn.gov.ng"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="editorialPolicyUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Editorial Policy URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/editorial-policy" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasDisclaimer"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel>Has Disclaimer</FormLabel>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value ?? true}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="riskLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Level</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Teenagers, Parents in Nigeria" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="citations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Citations (WHO, PubMed, etc.)</FormLabel>
                    <FormControl>
                      <CreatableSelect
                        isMulti
                        {...field}
                        onCreateOption={(value) => {
                          const newOption = { label: value, value };
                          field.onChange([...(field.value || []), newOption]);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⚙️ Advanced</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="readingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reading Time (min)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Version</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="v1.0" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastMedicalUpdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Medical Update</FormLabel>
                    <FormControl>
                      {/* <Input type="date" {...field} /> */}
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="intent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Intent</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="informational, commercial, etc." />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Button
          type="submit"
          className="max-w-40"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Spinner className="size-6" /> : "Save Post"}
        </Button>
      </form>
    </Form>
  );
}

// "use client";

// import { createPost, updatePost } from "@/app/actions/posts";
// import { generateSlug } from "@/lib/utils";
// import { zodResolver } from "@hookform/resolvers/zod";
// import dynamic from "next/dynamic";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { object, z } from "zod";
// import ImageUploader from "./image-uploader";
// import RichTextEditor from "./toolbars/editor";

// import { Button } from "./ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "./ui/form";
// import { Input } from "./ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { Spinner } from "./ui/spinner";

// const CreatableSelect = dynamic(() => import("react-select/creatable"), {
//   ssr: false,
// });

// const formSchema = z.object({
//   id: z.string().optional(),
//   title: z.string().min(3, { message: "Title is required" }),
//   slug: z.string().min(3, { message: "Slug is required" }),
//   content: z.string().min(3, { message: "Content is required" }),
//   imageUrl: z.string({ message: "Image URL is required" }),
//   imageAlt: z.string().optional(),
//   categoryId: z.string(),
//   tags: z.array(z.object({ label: z.string(), value: z.string() })),
//   categories: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
//   status: z.string(),
  
//   // SEO / Metadata
//   seoTitle: z.string(),
//   seoDescription: z.string(),
//   canonicalUrl: z.string(),
//   primaryKeyword: z.string(),

//   // Social media / OG
//   ogImage: z.string(),    
//   // twitterImage: z.string().optional(),
//   // featuredImage: z.string().optional(),
//   dateModified: z.date().optional(),
//   datePublished: z.date().optional(),

//   // Structured Data
//   author: z.string().optional(),
//   readingTime: z.coerce.number().min(0).optional(),
//   noIndex: z.boolean().optional(),
// });



// export type PostFormValues = z.infer<typeof formSchema>;

// export default function PostForm({
//   id,
//   title,
//   content,
//   imageUrl,
//   categoryId,
//   tags,
//   status,
//   categories,
//   slug,
//   imageAlt,
//   seoTitle,
//   seoDescription,
//   canonicalUrl,
//   primaryKeyword,
//   ogImage,
//   author,
//   readingTime,
//   noIndex,  
//   dateModified,
//   datePublished,

// }: PostFormValues) {
//   const router = useRouter();
//  const form = useForm({
//   resolver: zodResolver(formSchema),
//   defaultValues: {
//     id,
//     title,
//     slug,
//     content,
//     imageUrl,
//     imageAlt,
//     categoryId,
//     categories,
//     status,
//     tags,
//     seoTitle,
//     seoDescription,
//     canonicalUrl,
//     primaryKeyword,
//     ogImage,
//     author,
//     readingTime,
//     noIndex,
//     dateModified,
//     datePublished,

//   },
//   mode: "onBlur",
// });

//   const onSubmit = async (data: PostFormValues) => {
//     if (id) {
//       await updatePost(data);
//       toast.success("Post updated successfully");
//     } else {
//       await createPost(data);
//       toast.success("Post created successfully");
//     }

//     router.refresh();
//     router.push("/posts");
//   };

//   return (

//     <Form {...form}>
//   <form
//     className="grid md:grid-cols-2 grid-cols-1  gap-6"
//     onSubmit={form.handleSubmit(onSubmit)}
//   >
//     <div className="flex flex-col gap-6 py-6">
//       {/* Title */}
//       <FormField
//         control={form.control}
//         name="title"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Title</FormLabel>
//             <FormControl>
//               <Input
//                 {...field}
//                 onBlur={(e) => {
//                   field.onBlur();
//                   if (!form.getValues("slug")) {
//                     form.setValue("slug", generateSlug(e.target.value), {
//                       shouldValidate: true,
//                       shouldDirty: true,
//                     });
//                   }
//                 }}
//               />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       {/* Slug */}
//       <FormField
//         control={form.control}
//         name="slug"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Slug</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       {/* Image URL */}
//       <FormField
//         control={form.control}
//         name="imageUrl"
        
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Image</FormLabel>
//             <FormControl>
//               <div className="relative w-full aspect-[16/9]   sm:aspect-[4/3] lg:aspect-[21/9] overflow-hidden rounded-lg border">
//               <ImageUploader
//                 endpoint="imageUploader"
//                 defaultUrl={field.value || null}  
//                 onChange={(url) => field.onChange(url)}
//               />
//               </div>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />



//       {/* Image Alt */}
//       <FormField
//         control={form.control}
//         name="imageAlt"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Image Alt Text</FormLabel>
//             <FormControl>
//               <Input {...field} placeholder="Description for accessibility" />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       {/* Content */}
//       <FormField
//         control={form.control}
//         name="content"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Content</FormLabel>
//             <FormControl>
//               <RichTextEditor content={field.value} onChange={field.onChange} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       {/* Tags */}
//       <FormField
//         control={form.control}
//         name="tags"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Tags</FormLabel>
//             <FormControl>
//               <CreatableSelect
//                 isMulti
//                 isClearable
//                 {...field}
//                 onCreateOption={(value) => {
//                   const newOption = { label: value, value: value.toLowerCase() };
//                   field.onChange([...field.value, newOption]);
//                 }}
//                 components={{ IndicatorsContainer: () => null }}
//               />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       {/* SEO Fields */}
//       <FormField
//         control={form.control}
//         name="seoTitle"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>SEO Title</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       <FormField
//         control={form.control}
//         name="seoDescription"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>SEO Description</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       <FormField
//         control={form.control}
//         name="canonicalUrl"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Canonical URL</FormLabel>
//             <FormControl>
//               <Input {...field} placeholder="https://example.com/post" />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       <FormField
//         control={form.control}
//         name="primaryKeyword"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Primary Keyword</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       {/* OG Image */}
//       <FormField
//         control={form.control}
//         name="ogImage"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>OG Image</FormLabel>
//             <FormControl>
//                             <div className="relative w-full aspect-[16/9]  sm:aspect-[4/3] lg:aspect-[21/9] overflow-hidden rounded-lg border">

//               <ImageUploader
//                 endpoint="imageUploader"
//                 defaultUrl={field.value || null}
//                 onChange={field.onChange}
//               />
//               </div>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       {/* Author */}
//       <FormField
//         control={form.control}
//         name="author"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Author Name</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       {/* Reading Time */}
// <FormField
//   control={form.control}
//   name="readingTime"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Reading Time (minutes)</FormLabel>
//       <FormControl>
//         <Input
//           type="number"
//           min={0}
//           value={typeof field.value === "number" ? field.value : 0}
//           onChange={(e) =>
//             field.onChange(
//               e.target.value === "" ? undefined : Number(e.target.value)
//             )
//           }
//           onBlur={field.onBlur}
//           ref={field.ref}
//         />
//       </FormControl>
//       <FormMessage />
//     </FormItem>
//   )}
// />



//       {/* NoIndex */}
// <FormField
//   control={form.control}
//   name="noIndex"
//   render={({ field }) => (
//     <FormItem className="flex items-center gap-2">
//       <FormLabel>No Index (SEO)</FormLabel>
//       <FormControl>
//         <input
//           type="checkbox"
//           checked={field.value ?? false} // ✅ use checked for booleans
//           onChange={(e) => field.onChange(e.target.checked)} // pass boolean
//           onBlur={field.onBlur}
//           className="h-4 w-4"
//         />
//       </FormControl>
//     </FormItem>
//   )}
// />

//     </div>

//     <div className="flex flex-col gap-6">
//       <Card className="w-full max-w-sm">
//         <CardHeader>
//           <CardTitle>Extra Settings</CardTitle>
//         </CardHeader>
//         <CardContent className="flex flex-col gap-6">
//           {/* Category */}
//           <FormField
//             control={form.control}
//             name="categoryId"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Category</FormLabel>
//                 <FormControl>
//                   <Select
//                     {...field}
//                     onValueChange={field.onChange}
//                     defaultValue={categoryId}
//                   >
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="Category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories?.map((category) => (
//                         <SelectItem key={category.id} value={category.id}>
//                           {category.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Status */}
//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Status</FormLabel>
//                 <FormControl>
//                   <Select
//                     {...field}
//                     onValueChange={field.onChange}
//                     defaultValue={status}
//                   >
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="Status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {["published", "draft"].map((status) => (
//                         <SelectItem key={status} value={status}>
//                           {status}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </CardContent>
//       </Card>
//     </div>

//     <Button
//       type="submit"
//       className="max-w-40 cursor-pointer"
//       disabled={!form.formState.isValid || form.formState.isSubmitting}
//     >
//       {form.formState.isSubmitting ? <Spinner className="size-6" /> : "Save changes"}
//     </Button>
//   </form>
// </Form>


//   );
// }




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