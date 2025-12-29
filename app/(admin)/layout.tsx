// import { AppSidebar } from "@/components/app-sidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
  
//       <div className="p-6 w-full">
//         {children}
//         </div>
//     </SidebarProvider>
//   );
// }


import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarToggle } from "@/components/sidebar-toggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <main className="flex-1">
          {/* Top bar */}
          <div className="flex items-center gap-2 p-4 border-b">
            <SidebarToggle />
            <h1 className="font-semibold text-lg">Dashboard</h1>
          </div>

          {/* Page content */}
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
