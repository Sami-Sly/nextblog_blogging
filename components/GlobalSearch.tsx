// "use client";

// import { useEffect, useState } from "react";
// import { getAllCategories } from "@/app/actions/blog-public";
// import GlobalSearchModal from "@/components/global-search-modal";
// import { toast } from "sonner";

// export type CategoryResult = {
//   id: string;
//   name: string;
//   url: string;
// };

// export default function GlobalSearch() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [categories, setCategories] = useState<CategoryResult[]>([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const cats = await getAllCategories();
//         setCategories(
//           cats.map((c) => ({
//             id: c.id,
//             name: c.name,
//             url: `/blog/category/${c.id}`,
//           }))
//         );
//       } catch {
//         toast.error("Failed to load categories");
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <>
//       {/* Search button */}
//       <button onClick={() => setIsOpen(true)}>Search</button>

//       <GlobalSearchModal
//         isOpen={isOpen}
//         setIsOpen={setIsOpen}
//         categories={categories}
//       />
//     </>
//   );
// }
