
"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, ArrowLeft } from "lucide-react";
import type { DirectMessage, TrailAngel } from "@/lib/types";
import { format, formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TRAIL_ANGELS } from "@/lib/data";
import { userProfile } from "../app/user-profile-sheet";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import TrailAngelSheet from "./trail-angel-sheet";


type InboxSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: DirectMessage[];
  onSelectAngel: (angelId: string) => void;
};


// Main component for the Inbox
export default function InboxSheet({ open, onOpenChange, messages, onSelectAngel }: InboxSheetProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

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
    const latestMessage = convo.messages[0]; // Messages are sorted descending by time
    const partner = TRAIL_ANGELS.find(a => a.id === partnerId);
    return {
      partnerId: partnerId,
      partnerName: partner?.name || "Unknown",
      partnerAvatar: partner?.gallery[0] || userProfile.avatar,
      latestMessage: latestMessage.message,
      timestamp: latestMessage.timestamp,
      unreadCount: convo.unreadCount,
    };
  });
  
  const selectedConversation = selectedConversationId ? conversations[selectedConversationId]?.messages : null;
  const partner = selectedConversationId ? TRAIL_ANGELS.find(a => a.id === selectedConversationId) : null;


  const handleBack = () => {
    setSelectedConversationId(null);
  };
  
  const [isAngelSheetOpen, setAngelSheetOpen] = useState(false);

  const openAngelProfile = () => {
      if (partner) {
        onOpenChange(false);
        setAngelSheetOpen(true);
      }
  }

  const onAngelSheetChange = (isOpen: boolean) => {
    setAngelSheetOpen(isOpen);
    if (!isOpen) {
      onOpenChange(true);
    }
  }


  return (
    <>
    <Sheet open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            setSelectedConversationId(null); // Reset conversation view on close
        }
    }}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
          <SheetHeader className="p-6 pb-0 space-y-2 text-left shrink-0">
            <div className="flex items-center gap-4">
                {selectedConversationId && (
                    <Button variant="ghost" size="icon" onClick={handleBack} className="-ml-2">
                        <ArrowLeft />
                    </Button>
                )}
                 <SheetTitle className="text-3xl font-headline flex items-center gap-2">
                    {selectedConversationId ? partner?.name : 'Inbox'}
                 </SheetTitle>
            </div>
            {!selectedConversationId && messages.length === 0 && <SheetDescription>You have no new messages.</SheetDescription>}
          </SheetHeader>
        
        <ScrollArea className="flex-1">
            <div className="p-6">
                {!selectedConversationId ? (
                    // Conversation List View
                    messages.length === 0 ? (
                        <Card>
                            <CardContent className="flex items-center justify-center h-64 p-6">
                                <p className="text-muted-foreground">Your message history will appear here.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {conversationPreviews.map(convo => (
                                <Card key={convo.partnerId} className="p-4 cursor-pointer hover:bg-secondary" onClick={() => setSelectedConversationId(convo.partnerId)}>
                                    <div className="flex items-start gap-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={convo.partnerAvatar} alt={convo.partnerName} />
                                            <AvatarFallback>{convo.partnerName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold">{convo.partnerName}</p>
                                                <div className="flex items-center gap-2">
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(convo.timestamp), { addSuffix: true })}
                                                </p>
                                                {convo.unreadCount > 0 && <span className="block h-2 w-2 rounded-full bg-accent" />}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">{convo.latestMessage}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )
                ) : (
                    // Detailed Conversation View
                    <div className="space-y-4">
                        {partner && 
                            <div className="flex justify-center mb-4">
                                <Button variant="link" onClick={openAngelProfile}>View {partner.name}'s Profile</Button>
                            </div>
                        }
                        {selectedConversation?.slice().reverse().map(msg => (
                            <div key={msg.id} className={cn("flex flex-col gap-2", msg.senderId === 'user-wired' ? "items-end" : "items-start")}>
                                <div className={cn("max-w-xs rounded-lg p-3", msg.senderId === 'user-wired' ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                                    <p className="text-sm">{msg.message}</p>
                                </div>
                                <p className="text-xs text-muted-foreground px-1">
                                    {format(new Date(msg.timestamp), "MMM d, h:mm a")}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
    {partner && <TrailAngelSheet angel={isAngelSheetOpen ? partner : null} onOpenChange={onAngelSheetChange} />}
    </>
  );
}

