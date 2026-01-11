
"use client";

import type { ReactNode } from "react";
import React, { useState } from "react";
import Header from "./header";
import ProfileSheet from "./profile-sheet";
import InboxSheet from "./inbox-sheet";
import TrailRadioSheet from "./trail-radio-sheet";
import { InboxProvider, useInbox } from "@/context/inbox-provider";
import { useUserProfileStore } from "@/lib/user-profile-store";


type AppLayoutProps = {
  children: ReactNode;
};

function AppLayoutContent({ children }: AppLayoutProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [trailRadioOpen, setTrailRadioOpen] = useState(false);
  
  const { hasUnread, markAllAsRead } = useInbox();
  const userProfile = useUserProfileStore();
  
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
      <ProfileSheet profile={profileOpen ? userProfile : null} isCurrentUser={true} onOpenChange={setProfileOpen} />
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
