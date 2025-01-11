import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar className="fixed top-0 w-full z-50" />
      <div className="flex pt-16">
        <Sidebar className="hidden lg:block w-64 fixed h-[calc(100vh-4rem)] top-16 border-r bg-background overflow-y-auto" />
        <main className="flex-1 lg:pl-64 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
} 