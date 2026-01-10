"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitRadioMessage } from "@/lib/actions";
import { RADIO_MESSAGES, TRAIL_ANGELS } from "@/lib/data";
import type { RadioMessage, TrailAngel } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Posting..." : "Post to Radio"}
    </Button>
  );
}

type TrailRadioProps = {
  onSelectAngel: (angel: TrailAngel | string) => void;
  setProfileOpen?: (open: boolean) => void;
  isSheet?: boolean;
};


export default function TrailRadio({ onSelectAngel, setProfileOpen, isSheet }: TrailRadioProps) {
  const [messages, setMessages] = useState<RadioMessage[]>(RADIO_MESSAGES);
  const { toast } = useToast();
  
  const initialState = { success: false, message: "" };
  const [state, formAction] = useActionState(submitRadioMessage, initialState);
  
  const [formKey, setFormKey] = useState('initial-form-key');
  const [textareaValue, setTextareaValue] = useState('');

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Trail Radio" : "Moderation Alert",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });

      if (state.success) {
        // Optimistically add to UI, in a real app this would come from the DB.
        const newMessage: RadioMessage = {
          id: `new-${Date.now()}`,
          authorId: 'user-wired', // The current user
          author: 'You',
          message: textareaValue,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [newMessage, ...prev]);

        // Clear form
        setFormKey(Date.now().toString());
        setTextareaValue('');
      }
    }
  }, [state, toast, textareaValue]);

  const handleAuthorClick = (authorId: string) => {
    if (authorId === 'user-wired' && setProfileOpen) {
      setProfileOpen(true);
    } else {
      const angel = TRAIL_ANGELS.find(a => a.id === authorId);
      if (angel) {
        onSelectAngel(angel);
      }
    }
  };

  const messageList = (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div key={msg.id} className="text-sm">
          <p>
            <button onClick={() => handleAuthorClick(msg.authorId)} className="font-semibold hover:underline text-left">
              {msg.author}
            </button>
            <span className="text-xs text-muted-foreground font-normal ml-1">
              {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
            </span>
          </p>
          <p className="text-muted-foreground">{msg.message}</p>
        </div>
      ))}
    </div>
  );

  if (isSheet) {
    return (
        <>
            <div className="space-y-3">
                {messageList}
            </div>
            <form key={formKey} action={formAction} className="w-full space-y-2 mt-4">
                <Textarea 
                    name="message" 
                    placeholder="Post a utility request or trail update..." 
                    required 
                    minLength={3}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                />
                <SubmitButton />
            </form>
        </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="w-6 h-6" />
          <span>Trail Radio</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 pr-4">
          {messageList}
          <ScrollBar />
        </ScrollArea>
        <form key={formKey} action={formAction} className="w-full space-y-2 mt-4">
          <Textarea 
            name="message" 
            placeholder="Post a utility request or trail update..." 
            required 
            minLength={3}
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
          />
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
