
'use client';

import { DirectMessage, TrailAngel } from "@/lib/types";
import { TRAIL_ANGELS } from "@/lib/data";
import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

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

interface InboxContextType {
    messages: DirectMessage[];
    hasUnread: boolean;
    addMessageToInbox: (angel: TrailAngel, message: string) => void;
    markAllAsRead: () => void;
}

const InboxContext = createContext<InboxContextType | undefined>(undefined);

export const InboxProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<DirectMessage[]>(initialMessages);
    const hasUnread = useMemo(() => messages.some(m => !m.read && m.senderId !== 'user-wired'), [messages]);

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
        
        const angelReply: DirectMessage = {
           id: `dm-${Date.now() + 1}`,
          senderId: angel.id,
          senderName: angel.name,
          recipientId: "user-wired",
          recipientName: "You",
          message: `Thanks for reaching out! I'll get back to you soon about: "${message.substring(0, 20)}..."`,
          timestamp: new Date(Date.now() + 1000).toISOString(),
          read: false,
        }
    
        setMessages(prev => [angelReply, newMessage, ...prev]);
    }, []);

    const markAllAsRead = useCallback(() => {
        setMessages(prev => prev.map(m => ({ ...m, read: true })));
    }, []);

    const value = {
        messages,
        hasUnread,
        addMessageToInbox,
        markAllAsRead,
    };

    return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>
}

export const useInbox = () => {
    const context = useContext(InboxContext);
    if (context === undefined) {
        throw new Error('useInbox must be used within an InboxProvider');
    }
    return context;
}
