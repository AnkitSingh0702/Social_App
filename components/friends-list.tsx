"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { User } from "@/lib/types";
import api from "@/lib/api";
import { UserMinus, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface FriendsListProps {
  minimal?: boolean;
}

export function FriendsList({ minimal = false }: FriendsListProps) {
  const { data: friends = [], error, refetch } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/friends');
        return data;
      } catch (error) {
        console.error('Failed to fetch friends:', error);
        throw error;
      }
    }
  });

  if (error) {
    console.error('Friends list error:', error);
    return <div>Error loading friends</div>;
  }

  const handleUnfriend = async (userId: string) => {
    try {
      await api.delete(`/friends/${userId}`);
      toast.success("Friend removed");
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Friends</CardTitle>
        {minimal && (
          <Link
            href="/dashboard/friends"
            className="text-sm text-muted-foreground hover:underline"
          >
            View All
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {friends?.slice(0, minimal ? 3 : undefined).map((friend: User) => (
            <div
              key={friend._id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {friend.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{friend.username}</p>
                  <p className="text-sm text-muted-foreground">{friend.email}</p>
                </div>
              </div>
              {!minimal && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:bg-red-100 hover:text-red-700"
                  onClick={() => handleUnfriend(friend._id)}
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          ))}
          {(!friends || friends.length === 0) && (
            <p className="text-center text-muted-foreground py-8">
              You haven't added any friends yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 