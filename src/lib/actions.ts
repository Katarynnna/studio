
"use server";

import { moderateTrailRadioContent } from "@/ai/flows/moderate-trail-radio-content";
import { z } from "zod";

const radioSubmissionSchema = z.object({
  message: z.string().min(3, "Message must be at least 3 characters."),
});

type FormState = {
  success: boolean;
  message: string;
};

export async function submitRadioMessage(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = radioSubmissionSchema.safeParse({
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid message. Please check your input.",
    };
  }

  const { message } = validatedFields.data;

  try {
    const moderationResult = await moderateTrailRadioContent({ text: message });

    if (!moderationResult.isAppropriate) {
      return {
        success: false,
        message:
          moderationResult.reason || "Content was flagged as inappropriate.",
      };
    }

    // In a real app, you would save the message to a database here.
    console.log("Radio message approved and would be saved:", message);

    return {
      success: true,
      message: "Message posted successfully!",
    };
  } catch (error) {
    console.error("Error during content moderation:", error);
    return {
      success: false,
      message: "An error occurred while submitting your message.",
    };
  }
}


const directMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});


type DirectMessageFormState = {
  success: boolean;
  message: string;
  error: string | null;
  sentMessage: string | null;
};

export async function submitDirectMessage(
  angelId: string,
  prevState: DirectMessageFormState,
  formData: FormData
): Promise<DirectMessageFormState> {
  const validatedFields = directMessageSchema.safeParse({
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid message.",
      error: validatedFields.error.flatten().fieldErrors.message?.[0] ?? null,
      sentMessage: null,
    };
  }

  const { message } = validatedFields.data;

  // In a real app, you would save the message to a database here.
  console.log(`Message for angel ${angelId} would be saved:`, message);

  // We'll just simulate a success for now and return the message content.
  return {
    success: true,
    message: "Your message has been sent!",
    error: null,
    sentMessage: message,
  };
}
