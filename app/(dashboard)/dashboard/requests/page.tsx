"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FriendRequest } from "@/lib/types";
import api from "@/lib/api";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export default function RequestsPage() {
  const { data: requests, refetch } = useQuery({
    queryKey: ["friend-requests"],
    queryFn: async () => {
      const { data } = await api.get("/friends/requests");
      return data;
    },
  });

  const handleRequest = async (requestId: string, action: "accept" | "reject") => {
    try {
      await api.post(`/friends/requests/${requestId}/${action}`);
      toast.success(
        action === "accept"
          ? "Friend request accepted"
          : "Friend request rejected"
      );
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Friend Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {requests?.map((request: FriendRequest) => (
            <div
              key={request._id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">{request.from.username}</p>
                <p className="text-sm text-muted-foreground">
                  {request.from.email}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600"
                  onClick={() => handleRequest(request._id, "accept")}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                  onClick={() => handleRequest(request._id, "reject")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {(!requests || requests.length === 0) && (
            <p className="text-center text-muted-foreground">
              No pending friend requests
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 