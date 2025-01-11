"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { User } from "@/lib/types";
import api from "@/lib/api";
import { useDebounce } from "@/lib/hooks";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export function UserSearch() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const { data } = await api.get(`/users/search?q=${debouncedSearch}`);
      return data;
    },
    enabled: Boolean(debouncedSearch),
  });

  const handleSendRequest = async (userId: string) => {
    if (!userId) {
      toast.error("Invalid user");
      return;
    }
    
    try {
      await api.post(`/friends/request/${userId}`);
      toast.success("Friend request sent!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Friends</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isLoading ? (
          <div className="mt-4">Loading...</div>
        ) : (
          <div className="mt-4 space-y-2">
            {users?.map((user: User) => (
              <div
                key={user._id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendRequest(user._id)}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {users?.length === 0 && debouncedSearch && (
              <p className="text-center text-muted-foreground">
                No users found
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 