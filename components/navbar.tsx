// "use client";

// import { LayoutDashboard, LogOut, Search, LogIn } from "lucide-react";
// import Link from "next/link";
// import { useState } from "react";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { authClient } from "@/lib/auth-client";
// import { getNameInitials } from "@/lib/utils";
// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import GlobalSearchModal from "./global-search-modal";
// import { ThemeToggle } from "./theme-toggle";
// import { getAllPosts } from "@/app/actions/posts";

// const ADMIN_EMAIL = "samkam9945@gmail.com";

// export  async  function NavMenu({
//   userName,
//   userImage,
//   userEmail,
// }: {
//   userName?: string;
//   userImage?: string;
//   userEmail?: string;
// }) {
//   const isMobile = useIsMobile();
//   const [isOpen, setIsOpen] = useState(false);
// // app/page.tsx or wherever the modal is used
//   const isLoggedIn = !!userEmail;
//   const isAdmin = isLoggedIn && userEmail === ADMIN_EMAIL;

//   const handleSignOut = async () => {
//     await authClient.signOut();
//     window.location.href = "/sign-up";
//   };

//   return (
//     <NavigationMenu viewport={isMobile} className="mx-auto w-full max-w-[1200px] my-5">
//       <div className="flex justify-between w-full container">
//         {/* LEFT */}
//         <NavigationMenuList className="flex-wrap">
//           <NavigationMenuItem>
//             <NavigationMenuLink href="/">Home</NavigationMenuLink>
//           </NavigationMenuItem>
//         </NavigationMenuList>

//         {/* RIGHT */}
//         <NavigationMenuList className="flex items-center gap-4">
//           {/* Search */}
//           <NavigationMenuItem className="hidden md:block">
//             <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
//               <Search />
//             </div>
//             <GlobalSearchModal isOpen={isOpen} setIsOpen={setIsOpen} 
// /> 

//           </NavigationMenuItem>

//           {/* Theme Toggle */}
//           <NavigationMenuItem className="hidden md:block">
//             <ThemeToggle />
//           </NavigationMenuItem>

//           {/* Avatar Menu */}
//           <NavigationMenuItem className="hidden md:block">
//             <NavigationMenuTrigger>
//               <Avatar className="w-8 h-8 rounded-full">
//                 <AvatarImage src={userImage} className="rounded-full" />
//                 <AvatarFallback>
//                   {getNameInitials(userName || "U")}
//                 </AvatarFallback>
//               </Avatar>
//             </NavigationMenuTrigger>

//             <NavigationMenuContent>
//               <ul className="grid w-[140px] gap-4 p-2">
//                 {isAdmin && (
//                   <li>
//                     <NavigationMenuLink asChild>
//                       <Link href="/dashboard" className="flex items-center gap-2">
//                         <LayoutDashboard />
//                         Dashboard
//                       </Link>
//                     </NavigationMenuLink>
//                   </li>
//                 )}

//                 {isLoggedIn ? (
//                   <li>
//                     <NavigationMenuLink asChild>
//                       <div className="flex items-center gap-2 cursor-pointer" onClick={handleSignOut}>
//                         <LogOut />
//                         Sign out
//                       </div>
//                     </NavigationMenuLink>
//                   </li>
//                 ) : (
//                   <li>
//                     <NavigationMenuLink asChild>
//                       <Link href="/sign-up" className="flex items-center gap-2">
//                         <LogIn />
//                         Sign in
//                       </Link>
//                     </NavigationMenuLink>
//                   </li>
//                 )}
//               </ul>
//             </NavigationMenuContent>
//           </NavigationMenuItem>
//         </NavigationMenuList>
//       </div>
//     </NavigationMenu>
//   );
// }


"use client";

import {
  LayoutDashboard,
  LogOut,
  LogIn,
  Search,
  Menu,
  Home
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { getNameInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import GlobalSearchModal from "./global-search-modal";
import { ThemeToggle } from "./theme-toggle";

const ADMIN_EMAIL = "samkam9945@gmail.com";

export function NavMenu({ userName, userImage, userEmail }: any) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isLoggedIn = !!userEmail;
  const isAdmin = isLoggedIn && userEmail === ADMIN_EMAIL;

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/sign-up";
  };
const MenuLinks = () => (
  <div className="flex flex-col px-3 gap-6 text-base">
   <ThemeToggle />
    <Link href="/" onClick={() => setOpen(false)} className="flex gap-3 items-center font-medium">


      <Home className="h-5 w-5" /> Home
    </Link>

    <button onClick={() => setSearchOpen(true)} className="flex gap-3 items-center">
      <Search className="h-5 w-5" /> Search
    </button>

 

    {isAdmin && (
      <Link href="/dashboard" onClick={() => setOpen(false)} className="flex gap-3 items-center">
        <LayoutDashboard className="h-5 w-5" /> Dashboard
      </Link>
    )}

    <div className="border-t border-border/40 pt-4">
      {isLoggedIn ? (
        <button onClick={handleSignOut} className="flex gap-3 items-center text-red-500">
          <LogOut className="h-5 w-5" /> Sign Out
        </button>
      ) : (
        <Link href="/sign-up" onClick={() => setOpen(false)} className="flex gap-3 items-center">
          <LogIn className="h-5 w-5" /> Sign In
        </Link>
      )}
    </div>
  </div>
);


  return (
    <>
      <nav className="mx-auto max-w-[1200px] px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">HealthCare Blog</Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-4 items-center">
          <button onClick={() => setSearchOpen(true)}><Search /></button>
          <ThemeToggle />


          <Avatar className="w-8 h-8 rounded-full">
            <AvatarImage src={userImage} />
            <AvatarFallback>{getNameInitials(userName || "U")}</AvatarFallback>
          </Avatar>
        </div>

        {/* Mobile Hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden">
            <Menu size={28} />
          </SheetTrigger>

<SheetContent
  side="left"
  className="pt-12 border-none shadow-none divide-none [&>button]:scale-150 [&>button]:right-5 [&>button]:top-5"
>
  <MenuLinks />
</SheetContent>
        </Sheet>
      </nav>

      <GlobalSearchModal isOpen={searchOpen} setIsOpen={setSearchOpen} />
    </>
  );
}
