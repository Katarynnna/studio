"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Header from "./header";
import UserProfileSheet from "./user-profile-sheet";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header setProfileOpen={setProfileOpen} />
      <main className="flex-1 overflow-hidden">{children}</main>
      <UserProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}
