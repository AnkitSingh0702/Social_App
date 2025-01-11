"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { User } from "@/lib/types";
import api from "@/lib/api";
import { UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

interface RecommendedUser extends User {
  mutualFriends: number;
}

export function Recommendations() {
  const { data: recommendations } = useQuery<RecommendedUser[]>({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const { data } = await api.get("/friends/recommendations");
      return data;
    },
  });

  const handleSendRequest = async (userId: string) => {
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
        <CardTitle>Recommended Friends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recommendations?.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {user.mutualFriends} mutual friend{user.mutualFriends !== 1 ? 's' : ''}
                </p>
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
          {(!recommendations || recommendations.length === 0) && (
            <p className="text-center text-muted-foreground">
              No recommendations available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 