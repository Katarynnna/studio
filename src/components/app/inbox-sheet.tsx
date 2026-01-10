

"use client";

import { useState, useCallback, FormEvent } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import type { DirectMessage, TrailAngel } from "@/lib/types";
import { format, formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TRAIL_ANGELS } from "@/lib/data";
import { userProfile } from "../app/user-profile-sheet";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import TrailAngelSheet from "./trail-angel-sheet";
import { Textarea } from "../ui/textarea";

type InboxSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: DirectMessage[];
  addMessageToInbox: (angel: TrailAngel, message: string) => void;
};


// Main component for the Inbox
export default function InboxSheet({ open, onOpenChange, messages, addMessageToInbox }: InboxSheetProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [reply, setReply] = useState('');

  // Group messages by conversation partner
  const conversations = messages.reduce((acc, msg) => {
    const otherPartyId = msg.senderId === 'user-wired' ? msg.recipientId : msg.senderId;
    if (!acc[otherPartyId]) {
      acc[otherPartyId] = { messages: [], unreadCount: 0 };
    }
    acc[otherPartyId].messages.push(msg);
    if (!msg.read && msg.senderId !== 'user-wired') {
      acc[otherPartyId].unreadCount++;
    }
    return acc;
  }, {} as Record<string, { messages: DirectMessage[], unreadCount: number }>);

  // Memoize conversation previews
  const conversationPreviews = Object.keys(conversations).map(partnerId => {
    const convo = conversations[partnerId];
    const latestMessage = convo.messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    const partner = TRAIL_ANGELS.find(a => a.id === partnerId);
    return {
      partnerId: partnerId,
      partnerName: partner?.name || "Unknown",
      partnerAvatar: partner?.gallery[0] || userProfile.avatar,
      latestMessage: latestMessage.message,
      timestamp: latestMessage.timestamp,
      unreadCount: convo.unreadCount,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const selectedConversation = selectedConversationId ? conversations[selectedConversationId]?.messages : null;
  const partner = selectedConversationId ? TRAIL_ANGELS.find(a => a.id === selectedConversationId) : null;


  const handleBack = () => {
    setSelectedConversationId(null);
  };
  
  const [isAngelSheetOpen, setAngelSheetOpen] = useState(false);

  const openAngelProfile = useCallback(() => {
      if (partner) {
        onOpenChange(false);
        setAngelSheetOpen(true);
      }
  }, [partner, onOpenChange]);

  const onAngelSheetChange = (isOpen: boolean) => {
    setAngelSheetOpen(isOpen);
    if (!isOpen) {
      onOpenChange(true);
    }
  }
  
  const handleReply = (e: React.FormEvent) => {
      e.preventDefault();
      if (reply.trim() && partner) {
          addMessageToInbox(partner, reply.trim());
          setReply('');
      }
  }


  return (
    <>
    <Sheet open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            setTimeout(() => setSelectedConversationId(null), 300); // Reset conversation view on close after animation
        }
    }}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0 overflow-y-auto">
        <SheetHeader className="p-6 pb-0">
            <div className="flex flex-row items-center gap-2">
                {selectedConversationId && (
                    <Button variant="ghost" size="icon" onClick={handleBack} className="shrink-0 -ml-2">
                        <ArrowLeft />
                    </Button>
                )}
                 <SheetTitle className="text-3xl font-headline flex items-center gap-2">
                    {selectedConversationId ? (
                        <button onClick={openAngelProfile} className="hover:underline">{partner?.name}</button>
                    ) : 'Inbox'}
                 </SheetTitle>
            </div>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6">
                    {!selectedConversationId ? (
                        // Conversation List View
                        messages.length === 0 ? (
                             <div className="flex items-center justify-center h-64 text-muted-foreground">
                                <p>Your message history will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 pt-4">
                                {conversationPreviews.map(convo => (
                                    <Card key={convo.partnerId} className="p-4 cursor-pointer hover:bg-secondary" onClick={() => setSelectedConversationId(convo.partnerId)}>
                                        <div className="flex items-start gap-4">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={convo.partnerAvatar} alt={convo.partnerName} />
                                                <AvatarFallback>{convo.partnerName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold truncate">{convo.partnerName}</p>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(convo.timestamp), { addSuffix: true })}
                                                    </p>
                                                    {convo.unreadCount > 0 && <span className="block h-2 w-2 rounded-full bg-accent" />}
                                                    </div>
                                                </div>
                                                <p className={cn("text-sm  truncate", convo.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>{convo.latestMessage}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )
                    ) : (
                        // Detailed Conversation View
                        <div className="space-y-4 pt-4">
                            {selectedConversation?.slice().sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map(msg => (
                                <div key={msg.id} className={cn("flex flex-col gap-2 w-full", msg.senderId === 'user-wired' ? "items-end" : "items-start")}>
                                    <div className={cn("max-w-[80%] rounded-lg p-3", msg.senderId === 'user-wired' ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                                        <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground px-1">
                                        {format(new Date(msg.timestamp), "MMM d, h:mm a")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
            {selectedConversationId && (
                <div className="p-6 border-t bg-background shrink-0 sticky bottom-0">
                    <form onSubmit={handleReply} className="flex items-center gap-2">
                        <Textarea 
                            placeholder="Type a message..." 
                            className="flex-1"
                            value={reply}
                            onChange={e => setReply(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleReply(e);
                                }
                            }}
                        />
                        <Button type="submit" size="icon" disabled={!reply.trim()}>
                            <Send />
                        </Button>
                    </form>
                </div>
            )}
        </div>
      </SheetContent>
    </Sheet>
    {partner && <TrailAngelSheet angel={isAngelSheetOpen ? partner : null} onOpenChange={onAngelSheetChange} addMessageToInbox={addMessageToInbox} />}
    </>
  );
}
