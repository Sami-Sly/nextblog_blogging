"use client";

import { LayoutDashboard, LogOut, Search, LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import { getNameInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import GlobalSearchModal from "./global-search-modal";
import { ThemeToggle } from "./theme-toggle";

const ADMIN_EMAIL = "samkam9945@gmail.com";

export function NavMenu({
  userName,
  userImage,
  userEmail,
}: {
  userName?: string;
  userImage?: string;
  userEmail?: string;
}) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const isLoggedIn = !!userEmail;
  const isAdmin = isLoggedIn && userEmail === ADMIN_EMAIL;

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/sign-up";
  };

  return (
    <NavigationMenu viewport={isMobile} className="mx-auto w-full max-w-[1200px] my-5">
      <div className="flex justify-between w-full container">
        {/* LEFT */}
        <NavigationMenuList className="flex-wrap">
          <NavigationMenuItem>
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>

        {/* RIGHT */}
        <NavigationMenuList className="flex items-center gap-4">
          {/* Search */}
          <NavigationMenuItem className="hidden md:block">
            <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
              <Search />
            </div>
            <GlobalSearchModal isOpen={isOpen} setIsOpen={setIsOpen} />
          </NavigationMenuItem>

          {/* Theme Toggle */}
          <NavigationMenuItem className="hidden md:block">
            <ThemeToggle />
          </NavigationMenuItem>

          {/* Avatar Menu */}
          <NavigationMenuItem className="hidden md:block">
            <NavigationMenuTrigger>
              <Avatar className="w-8 h-8 rounded-full">
                <AvatarImage src={userImage} className="rounded-full" />
                <AvatarFallback>
                  {getNameInitials(userName || "U")}
                </AvatarFallback>
              </Avatar>
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <ul className="grid w-[140px] gap-4 p-2">
                {isAdmin && (
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard />
                        Dashboard
                      </Link>
                    </NavigationMenuLink>
                  </li>
                )}

                {isLoggedIn ? (
                  <li>
                    <NavigationMenuLink asChild>
                      <div className="flex items-center gap-2 cursor-pointer" onClick={handleSignOut}>
                        <LogOut />
                        Sign out
                      </div>
                    </NavigationMenuLink>
                  </li>
                ) : (
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/sign-up" className="flex items-center gap-2">
                        <LogIn />
                        Sign in
                      </Link>
                    </NavigationMenuLink>
                  </li>
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
}