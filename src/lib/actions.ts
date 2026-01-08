"use server";

import { moderateTrailRadioContent } from "@/ai/flows/moderate-trail-radio-content";
import { z } from "zod";

const submissionSchema = z.object({
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
  const validatedFields = submissionSchema.safeParse({
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
    // For this demo, we just simulate a success.
    console.log("Message approved and would be saved:", message);

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
