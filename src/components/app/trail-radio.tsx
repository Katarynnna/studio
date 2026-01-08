"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitRadioMessage } from "@/lib/actions";
import { RADIO_MESSAGES } from "@/lib/data";
import type { RadioMessage } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Posting..." : "Post to Radio"}
    </Button>
  );
}

export default function TrailRadio() {
  const [messages, setMessages] = useState<RadioMessage[]>(RADIO_MESSAGES);
  const { toast } = useToast();
  
  const initialState = { success: false, message: "" };
  const [state, formAction] = useFormState(submitRadioMessage, initialState);
  
  const [formKey, setFormKey] = useState(Date.now());
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
          author: 'You',
          message: textareaValue,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [newMessage, ...prev]);

        // Clear form
        setFormKey(Date.now());
        setTextareaValue('');
      }
    }
  }, [state, toast, textareaValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="w-6 h-6" />
          <span>Trail Radio</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 h-64 overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <p className="font-semibold">{msg.author} <span className="text-xs text-muted-foreground font-normal ml-1">{formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}</span></p>
              <p className="text-muted-foreground">{msg.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <form key={formKey} action={formAction} className="w-full space-y-2">
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
      </CardFooter>
    </Card>
  );
}
