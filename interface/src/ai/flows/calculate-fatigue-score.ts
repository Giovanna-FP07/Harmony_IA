'use server';

/**
 * @fileOverview Calculates a fatigue score based on biometric data and user input.
 *
 * - calculateFatigueScore - A function that calculates the fatigue score.
 * - CalculateFatigueScoreInput - The input type for the calculateFatigueScore function.
 * - CalculateFatigueScoreOutput - The return type for the calculateFatigueScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateFatigueScoreInputSchema = z.object({
  heartRateVariability: z.number().describe('Heart rate variability measurement.'),
  sleepDuration: z.number().describe('Duration of sleep in hours.'),
  stressLevel: z.number().describe('Self-reported stress level on a scale of 1-10.'),
  activityLevel: z.number().describe('Self-reported activity level on a scale of 1-10.'),
});
export type CalculateFatigueScoreInput = z.infer<typeof CalculateFatigueScoreInputSchema>;

const CalculateFatigueScoreOutputSchema = z.object({
  fatigueScore: z.number().describe('The calculated fatigue score, higher is more fatigued.'),
  recommendations: z.string().describe('Personalized recommendations to reduce fatigue.'),
});
export type CalculateFatigueScoreOutput = z.infer<typeof CalculateFatigueScoreOutputSchema>;

export async function calculateFatigueScore(input: CalculateFatigueScoreInput): Promise<CalculateFatigueScoreOutput> {
  return calculateFatigueScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateFatigueScorePrompt',
  input: {schema: CalculateFatigueScoreInputSchema},
  output: {schema: CalculateFatigueScoreOutputSchema},
  prompt: `Você é um assistente de bem-estar com IA que ajuda a calcular a pontuação de fadiga de um usuário e a fornecer recomendações personalizadas.

  Calcule uma pontuação de fadiga com base nos seguintes dados biométricos e auto-relatados. A pontuação de fadiga deve ser um número entre 0 e 100. Um valor mais alto indica que o usuário está mais fadigado. Baseie o cálculo nos dados, usando seu melhor julgamento. Liste os fatores que você usou para calcular a pontuação.

  Em seguida, forneça recomendações personalizadas para reduzir a fadiga com base nos dados do usuário. Faça recomendações específicas e acionáveis. Responda em português.

  Variabilidade da Frequência Cardíaca: {{heartRateVariability}}
  Duração do Sono: {{sleepDuration}} horas
  Nível de Estresse: {{stressLevel}} (escala de 1-10)
  Nível de Atividade: {{activityLevel}} (escala de 1-10)

  Responda no seguinte formato JSON:
  {
    "fatigueScore": number,
    "recommendations": string
  }`,
});

const calculateFatigueScoreFlow = ai.defineFlow(
  {
    name: 'calculateFatigueScoreFlow',
    inputSchema: CalculateFatigueScoreInputSchema,
    outputSchema: CalculateFatigueScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
