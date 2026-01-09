
"use client";

import type { ReactNode } from "react";
import React, { useState, useCallback } from "react";
import Header from "./header";
import UserProfileSheet from "./user-profile-sheet";
import InboxSheet from "./inbox-sheet";
import TrailRadioSheet from "./trail-radio-sheet";
import { type DirectMessage, type TrailAngel } from "@/lib/types";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [trailRadioOpen, setTrailRadioOpen] = useState(false);
  const [messages, setMessages] = useState<DirectMessage[]>([]);

  const addMessageToInbox = useCallback((angel: TrailAngel, message: string) => {
    const newMessage: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderId: "user-wired",
      senderName: "You",
      recipientId: angel.id,
      recipientName: angel.name,
      message: message,
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages(prev => [newMessage, ...prev]);
  }, []);

  // Pass state setters and message handler to children.
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // @ts-expect-error - injecting props
      return React.cloneElement(child, { setProfileOpen, addMessageToInbox });
    }
    return child;
  });

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header setProfileOpen={setProfileOpen} setInboxOpen={setInboxOpen} setTrailRadioOpen={setTrailRadioOpen} />
      <main className="flex-1 overflow-hidden">{childrenWithProps}</main>
      <UserProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
      <InboxSheet open={inboxOpen} onOpenChange={setInboxOpen} messages={messages} />
      <TrailRadioSheet open={trailRadioOpen} onOpenChange={setTrailRadioOpen} />
    </div>
  );
}
