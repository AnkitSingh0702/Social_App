"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export function PostDialog() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Check file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!image) {
        toast.error("Please select an image");
        return;
      }

      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);

      const response = await api.post("/posts", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Post created successfully!");
      setCaption("");
      setImage(null);
      setPreview(null);
    } catch (error: any) {
      console.error('Post error:', error);
      toast.error(error.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            className="relative h-60 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50"
            onClick={() => document.getElementById("image-input")?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <ImagePlus className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload image
                </p>
              </div>
            )}
            <Input
              id="image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <Textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <Button className="w-full" onClick={handleSubmit}>
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 