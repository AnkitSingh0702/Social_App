"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, UserPlus, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Friends",
    icon: Users,
    href: "/dashboard/friends",
    color: "text-violet-500",
  },
  {
    label: "Requests",
    icon: UserPlus,
    href: "/dashboard/requests",
    color: "text-pink-700",
  },
  {
    label: "Notifications",
    icon: Bell,
    href: "/dashboard/notifications",
    color: "text-orange-700",
  },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate, ...props }: SidebarProps) {
  const pathname = usePathname();
  const { data: requests } = useQuery({
    queryKey: ["friend-requests"],
    queryFn: async () => {
      const { data } = await api.get("/friends/requests");
      return data;
    },
  });

  return (
    <aside className={cn("border-r bg-background p-6", className)} {...props}>
      <div className="flex flex-col gap-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === route.href
                ? "bg-primary/10 text-primary"
                : "hover:bg-primary/5"
            )}
          >
            <div className="flex items-center gap-x-2">
              <route.icon className={cn("h-5 w-5", route.color)} />
              {route.label}
            </div>
            {route.label === "Requests" && requests?.length > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                {requests.length}
              </span>
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
} 