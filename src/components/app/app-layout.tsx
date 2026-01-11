

"use client";

import type { ReactNode } from "react";
import React, { useState, useMemo } from "react";
import Header from "./header";
import UserProfileSheet from "./user-profile-sheet";
import InboxSheet from "./inbox-sheet";
import TrailRadioSheet from "./trail-radio-sheet";
import { type TrailAngel } from "@/lib/types";
import { InboxProvider, useInbox } from "@/context/inbox-provider";


type AppLayoutProps = {
  children: ReactNode;
};

function AppLayoutContent({ children }: AppLayoutProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [trailRadioOpen, setTrailRadioOpen] = useState(false);
  
  const { messages, hasUnread, addMessageToInbox, markAllAsRead } = useInbox();
  
  const handleInboxOpenChange = (open: boolean) => {
    setInboxOpen(open);
    if (!open) {
      markAllAsRead();
    }
  }

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && (child.type === require('@/components/app/main-view').default || child.type === require('@/app/profile/edit/page').default)) {
      // @ts-expect-error - injecting props
      return React.cloneElement(child, { setProfileOpen });
    }
    return child;
  });

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header 
        setProfileOpen={setProfileOpen} 
        setInboxOpen={setInboxOpen} 
        setTrailRadioOpen={setTrailRadioOpen} 
        hasUnreadMessages={hasUnread}
      />
      <main className="flex-1 bg-background">{childrenWithProps}</main>
      <UserProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
      <InboxSheet 
        open={inboxOpen} 
        onOpenChange={handleInboxOpenChange} 
      />
      <TrailRadioSheet open={trailRadioOpen} onOpenChange={setTrailRadioOpen} />
    </div>
  );
}


export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <InboxProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </InboxProvider>
  )
}
