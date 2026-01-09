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

type InboxSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function InboxSheet({ open, onOpenChange }: InboxSheetProps) {
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
              <SheetDescription>You have no new messages.</SheetDescription>
            </SheetHeader>
            <Card className="mt-6">
                <CardContent className="flex items-center justify-center h-64 p-6">
                    <p className="text-muted-foreground">Your message history will appear here.</p>
                </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
