import { Outlet } from "react-router-dom";
import Sidebar from "./ui/sidebar";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";

function AdminLayoutContent() {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <div className={`min-h-screen transition-all duration-300 ${
        isOpen ? "md:pl-64 pl-0" : "md:pl-16 pl-0"
      }`}>
        <main className="min-h-screen p-4 sm:p-6 pt-16 sm:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminLayoutContent />
    </SidebarProvider>
  );
}
