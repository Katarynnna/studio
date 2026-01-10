

"use client";

import type { ReactNode } from "react";
import React, { useState, useCallback, useMemo } from "react";
import Header from "./header";
import UserProfileSheet from "./user-profile-sheet";
import InboxSheet from "./inbox-sheet";
import TrailRadioSheet from "./trail-radio-sheet";
import { type DirectMessage, type TrailAngel } from "@/lib/types";
import { TRAIL_ANGELS } from "@/lib/data";

const initialMessages: DirectMessage[] = [
  {
    id: 'dm-1',
    senderId: 'ta-1',
    senderName: 'Bighorn Betty',
    recipientId: 'user-wired',
    recipientName: 'You',
    message: "Hey there! I saw you were asking about water sources. The creek at mile 179 is flowing well. Let me know if you need anything when you get to Wrightwood!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'dm-2',
    senderId: 'user-wired',
    senderName: 'You',
    recipientId: 'ta-2',
    recipientName: 'Cascade Dave',
    message: "Hi Dave, do you have space for a hiker to stay tomorrow night?",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'dm-3',
    senderId: 'ta-2',
    senderName: 'Cascade Dave',
    recipientId: 'user-wired',
    recipientName: 'You',
    message: "You bet! The spare room is all yours. See you then.",
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    read: true,
  }
];


type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [trailRadioOpen, setTrailRadioOpen] = useState(false);
  const [messages, setMessages] = useState<DirectMessage[]>(initialMessages);
  
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
      <main className="flex-1 bg-background">{childrenWithProps}</main>
      <UserProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
      <InboxSheet 
        open={inboxOpen} 
        onOpenChange={handleInboxOpenChange} 
        messages={messages}
        addMessageToInbox={addMessageToInbox}
        onSelectAngel={(angelId) => {
          // This could be used to open a profile or map from the inbox
          const angel = TRAIL_ANGELS.find(a => a.id === angelId);
          console.log("Selected angel:", angel?.name);
        }}
      />
      <TrailRadioSheet open={trailRadioOpen} onOpenChange={setTrailRadioOpen} />
    </div>
  );
}
