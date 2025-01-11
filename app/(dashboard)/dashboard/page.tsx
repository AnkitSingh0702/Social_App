"use client";

import { UserSearch } from "@/components/user-search";
import { FriendsList } from "@/components/friends-list";
import { Recommendations } from "@/components/recommendations";
import { Posts } from "@/components/posts";

export default function DashboardPage() {
  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <UserSearch />
            <Posts />
          </div>
        </div>
        <div className="hidden lg:block space-y-6">
          <div className="sticky top-24">
            <Recommendations />
            <div className="mt-6">
              <FriendsList minimal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 