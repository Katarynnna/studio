
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail } from "lucide-react";
import type { DirectMessage } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TRAIL_ANGELS } from "@/lib/data";
import { userProfile } from "../app/user-profile-sheet";


type InboxSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: DirectMessage[];
};

export default function InboxSheet({ open, onOpenChange, messages }: InboxSheetProps) {

  // Group messages by conversation partner
  const conversations = messages.reduce((acc, msg) => {
    const otherPartyId = msg.senderId === 'user-wired' ? msg.recipientId : msg.senderId;
    if (!acc[otherPartyId]) {
      acc[otherPartyId] = [];
    }
    acc[otherPartyId].push(msg);
    return acc;
  }, {} as Record<string, DirectMessage[]>);

  // Get the latest message for each conversation to display as a preview
  const conversationPreviews = Object.keys(conversations).map(partnerId => {
    const convoMessages = conversations[partnerId];
    const latestMessage = convoMessages[0]; // Messages are sorted descending by time
    const partner = TRAIL_ANGELS.find(a => a.id === partnerId);
    return {
      partnerId: partnerId,
      partnerName: partner?.name || "Unknown",
      partnerAvatar: partner?.gallery[0] || userProfile.avatar,
      latestMessage: latestMessage.message,
      timestamp: latestMessage.timestamp,
    };
  });


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="space-y-2 text-left">
              <SheetTitle className="text-3xl font-headline flex items-center gap-2">
                <Mail className="w-8 h-8" />
                Inbox
              </SheetTitle>
              {messages.length === 0 && <SheetDescription>You have no new messages.</SheetDescription>}
            </SheetHeader>
            
            {messages.length === 0 ? (
                <Card className="mt-6">
                    <CardContent className="flex items-center justify-center h-64 p-6">
                        <p className="text-muted-foreground">Your message history will appear here.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="mt-6 space-y-4">
                    {conversationPreviews.map(convo => (
                        <Card key={convo.partnerId} className="p-4 cursor-pointer hover:bg-secondary">
                            <div className="flex items-start gap-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={convo.partnerAvatar} alt={convo.partnerName} />
                                    <AvatarFallback>{convo.partnerName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{convo.partnerName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(convo.timestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{convo.latestMessage}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
