'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized well-being recommendations based on a user's fatigue score.
 *
 * - `getPersonalizedRecommendations`:  A function that takes a fatigue score as input and returns personalized well-being recommendations.
 * - `PersonalizedRecommendationsInput`: The input type for the `getPersonalizedRecommendations` function, containing the fatigue score.
 * - `PersonalizedRecommendationsOutput`: The output type for the `getPersonalizedRecommendations` function, containing an array of recommendation strings.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  fatigueScore: z.number().describe('A numerical score representing the user\'s fatigue level.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('An array of personalized well-being recommendations.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a well-being expert. Based on the user's fatigue score, provide personalized recommendations for interventions such as guided pauses or stretching exercises.

Fatigue Score: {{{fatigueScore}}}

Respond with an array of strings.  Each string is a personalized recommendation.  Keep the recommendations concise and actionable.
`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
