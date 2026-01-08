'use server';

/**
 * @fileOverview A content moderation AI agent for the trail radio feed.
 *
 * - moderateTrailRadioContent - A function that moderates content in the trail radio feed.
 * - ModerateTrailRadioContentInput - The input type for the moderateTrailRadioContent function.
 * - ModerateTrailRadioContentOutput - The return type for the moderateTrailRadioContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateTrailRadioContentInputSchema = z.object({
  text: z.string().describe('The text content of the trail radio post.'),
});
export type ModerateTrailRadioContentInput = z.infer<typeof ModerateTrailRadioContentInputSchema>;

const ModerateTrailRadioContentOutputSchema = z.object({
  isAppropriate: z.boolean().describe('Whether the content is appropriate or not.'),
  reason: z.string().optional().describe('The reason why the content is flagged as inappropriate, if applicable.'),
});
export type ModerateTrailRadioContentOutput = z.infer<typeof ModerateTrailRadioContentOutputSchema>;

export async function moderateTrailRadioContent(input: ModerateTrailRadioContentInput): Promise<ModerateTrailRadioContentOutput> {
  return moderateTrailRadioContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderateTrailRadioContentPrompt',
  input: {schema: ModerateTrailRadioContentInputSchema},
  output: {schema: ModerateTrailRadioContentOutputSchema},
  prompt: `You are a content moderator for a trail radio feed. Your task is to determine whether the given text is appropriate for the feed. Consider factors such as inappropriate language, suspicious requests, or any content that violates community guidelines. 

Text: {{{text}}}

Based on the text, determine if it is appropriate or not. If it is not appropriate, provide a reason why.

Please provide your response in JSON format.
`,
});

const moderateTrailRadioContentFlow = ai.defineFlow(
  {
    name: 'moderateTrailRadioContentFlow',
    inputSchema: ModerateTrailRadioContentInputSchema,
    outputSchema: ModerateTrailRadioContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
