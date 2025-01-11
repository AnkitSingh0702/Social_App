"use client";

import { useAuthStore } from "@/lib/store";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

export function Navbar({ className, ...props }: NavbarProps) {
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <header 
      className={cn(
        "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )} 
      {...props}
    >
      <div className="   px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <div className="h-16 border-b px-6 flex items-center">
                  <Link 
                    href="/dashboard" 
                    className="text-lg font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    FriendsApp
                  </Link>
                </div>
                <Sidebar 
                  className="border-none px-2 pb-6" 
                  onNavigate={() => setOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <Link 
              href="/dashboard" 
              className="text-xl font-semibold tracking-tight"
            >
              FriendsApp
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
} 