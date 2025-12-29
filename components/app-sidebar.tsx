import { Calendar, Home, Inbox, Search } from "lucide-react";
import Link from "next/link";
import { SidebarClose } from "@/components/sidebar-close";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Posts", url: "/posts", icon: Inbox },
  { title: "Categories", url: "/categories", icon: Calendar },
  { title: "Saved Posts", url: "/saved-posts", icon: Search },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* Header */}
          <div className="flex items-center justify-between px-2 py-1">
            <SidebarGroupLabel>NextBlog</SidebarGroupLabel>
            <SidebarClose />
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
