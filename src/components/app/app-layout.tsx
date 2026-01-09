
"use client";

import type { ReactNode } from "react";
import React, { useState, useCallback, useMemo } from "react";
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
  
  const hasUnreadMessages = useMemo(() => messages.some(m => !m.read && m.senderId !== 'user-wired'), [messages]);

  const addMessageToInbox = useCallback((angel: TrailAngel, message: string) => {
    const newMessage: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderId: "user-wired",
      senderName: "You",
      recipientId: angel.id,
      recipientName: angel.name,
      message: message,
      timestamp: new Date().toISOString(),
      read: true, // Messages sent by user are always read
    };
    
    const angelReply: DirectMessage = {
       id: `dm-${Date.now() + 1}`,
      senderId: angel.id,
      senderName: angel.name,
      recipientId: "user-wired",
      recipientName: "You",
      message: `Thanks for reaching out! I'll get back to you soon about: "${message.substring(0, 20)}..."`,
      timestamp: new Date(Date.now() + 1000).toISOString(),
      read: false, // New message from angel is unread
    }

    setMessages(prev => [angelReply, newMessage, ...prev]);
  }, []);
  
  const handleInboxOpenChange = (open: boolean) => {
    setInboxOpen(open);
    if (!open) {
      // Mark all messages as read when inbox is closed
      setMessages(prev => prev.map(m => ({ ...m, read: true })));
    }
  }


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
      <Header 
        setProfileOpen={setProfileOpen} 
        setInboxOpen={setInboxOpen} 
        setTrailRadioOpen={setTrailRadioOpen} 
        hasUnreadMessages={hasUnreadMessages}
      />
      <main className="flex-1 overflow-hidden">{childrenWithProps}</main>
      <UserProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
      <InboxSheet 
        open={inboxOpen} 
        onOpenChange={handleInboxOpenChange} 
        messages={messages}
        onSelectAngel={(angelId) => {
          console.log("Selected angel:", angelId);
        }}
      />
      <TrailRadioSheet open={trailRadioOpen} onOpenChange={setTrailRadioOpen} />
    </div>
  );
}
