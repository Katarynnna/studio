"use client";

import type { ReactNode } from "react";
import React, { useState } from "react";
import Header from "./header";
import UserProfileSheet from "./user-profile-sheet";
import InboxSheet from "./inbox-sheet";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);

  // Pass state setters to children. A bit of prop drilling, but acceptable for this level of complexity.
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // @ts-expect-error - injecting props
      return React.cloneElement(child, { setProfileOpen });
    }
    return child;
  });

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header setProfileOpen={setProfileOpen} setInboxOpen={setInboxOpen} />
      <main className="flex-1 overflow-hidden">{childrenWithProps}</main>
      <UserProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
      <InboxSheet open={inboxOpen} onOpenChange={setInboxOpen} />
    </div>
  );
}
