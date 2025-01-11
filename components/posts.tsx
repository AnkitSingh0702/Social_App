"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { Post } from "@/lib/types";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
import { useCallback, useState } from "react";
import { PlaceholderImage } from "./ui/placeholder-image";

export function Posts() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/posts");
        return data;
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        throw error;
      }
    },
  });

  const handleLike = useCallback(async (postId: string) => {
    try {
      await api.post(`/posts/${postId}/like`);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post liked!");
    } catch (error: any) {
      console.error('Like error:', error);
      toast.error(error.response?.data?.message || "Failed to like post");
    }
  }, [queryClient]);

  const handleImageError = useCallback((postId: string) => {
    setImageError(prev => ({
      ...prev,
      [postId]: true
    }));
  }, []);

  return (
    <div className="space-y-8">
      {posts.map((post: Post) => (
        <Card key={post._id} className="overflow-hidden max-w-2xl mx-auto">
          <CardHeader className="flex-row items-center gap-4 p-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {post.user?.username?.slice(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{post.user?.username}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardHeader>
          <div className="relative w-full h-[400px] bg-muted">
            {imageError[post._id] ? (
              <PlaceholderImage />
            ) : (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${post.image}`}
                alt={post.caption}
                className="absolute inset-0 w-full h-full object-contain"
                onError={() => handleImageError(post._id)}
              />
            )}
          </div>
          <CardContent className="space-y-4 p-4">
            <p className="text-sm break-words">{post.caption}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post._id)}
                className={`hover:bg-muted/50 ${
                  post.likes.includes(user?._id || "") ? "text-red-500" : ""
                }`}
              >
                <Heart className="h-5 w-5 mr-1.5" />
                <span>{post.likes.length}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {!posts.length && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet</p>
        </div>
      )}
    </div>
  );
} 