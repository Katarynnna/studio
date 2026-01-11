
"use client";

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { TrailAngel } from "@/lib/types";
import { submitDirectMessage } from "@/lib/actions";
import { useInbox } from "@/context/inbox-provider";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}

type SendMessageDialogProps = {
  angel: TrailAngel;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SendMessageDialog({ angel, children, open, onOpenChange }: SendMessageDialogProps) {
  const { toast } = useToast();
  const { addMessageToInbox } = useInbox();
  const [textareaValue, setTextareaValue] = useState('');
  
  const initialState = { success: false, message: "", error: null, sentMessage: null };
  const sendMessageWithAngelId = submitDirectMessage.bind(null, angel.id);
  const [state, formAction] = useActionState(sendMessageWithAngelId, initialState);


  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Message Sent" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });

      if (state.success && state.sentMessage && addMessageToInbox) {
        addMessageToInbox(angel, state.sentMessage);
        onOpenChange(false);
        setTextareaValue('');
      }
    }
  }, [state, toast, onOpenChange, angel, addMessageToInbox]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Message {angel.name}</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
            <div className="grid gap-4 py-4">
                <Textarea
                    id="message"
                    name="message"
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    placeholder={`Hi ${angel.name}, I'm hiking the trail and was wondering...`}
                    required
                />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <SubmitButton />
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
