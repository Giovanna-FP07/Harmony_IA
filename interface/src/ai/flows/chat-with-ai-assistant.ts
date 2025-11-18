'use server';

/**
 * @fileOverview Implements the chat with AI assistant flow for the Harmony IA app.
 *
 * - chatWithAiAssistant - A function that handles the chat interaction with the AI assistant.
 * - ChatWithAiAssistantInput - The input type for the chatWithAi-assistant function.
 * - ChatWithAiAssistantOutput - The return type for the chatWithAiAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithAiAssistantInputSchema = z.object({
  message: z.string().describe('The user message to the AI assistant.'),
  context: z.string().optional().describe('The current context of the user, which may include their name.'),
});
export type ChatWithAiAssistantInput = z.infer<typeof ChatWithAiAssistantInputSchema>;

const ChatWithAiAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user message.'),
  actionItems: z.array(z.string()).optional().describe('A list of action items extracted from the user message.'),
});
export type ChatWithAiAssistantOutput = z.infer<typeof ChatWithAiAssistantOutputSchema>;

export async function chatWithAiAssistant(input: ChatWithAiAssistantInput): Promise<ChatWithAiAssistantOutput> {
  return chatWithAiAssistantFlow(input);
}

const extractActionItems = ai.defineTool(
  {
    name: 'extractActionItems',
    description: 'Extracts action items from a given text.',
    inputSchema: z.object({
      text: z.string().describe('The text to extract action items from.'),
    }),
    outputSchema: z.array(z.string()).describe('A list of action items.'),
  },
  async input => {
    const {text} = input;
    // Placeholder implementation for action item extraction.  Replace with actual implementation if available.
    return [`Action item 1 from: ${text}`];
  }
);

const chatWithAiAssistantPrompt = ai.definePrompt({
  name: 'chatWithAiAssistantPrompt',
  input: {schema: ChatWithAiAssistantInputSchema},
  output: {schema: ChatWithAiAssistantOutputSchema},
  tools: [extractActionItems],
  prompt: `Você é a Aura, uma assistente de IA para o aplicativo Harmony IA. Seu papel é fornecer suporte, responder a perguntas e dar feedback ao usuário com base em seu estado atual e possíveis intervenções. Seja sempre amigável e se dirija ao usuário pelo nome, se ele for fornecido.

Contexto Atual: {{context}}

Mensagem do Usuário: {{message}}

Gere uma resposta útil e informativa para o usuário. Além disso, extraia quaisquer itens de ação da mensagem do usuário usando a ferramenta extractActionItems.`,
});

const chatWithAiAssistantFlow = ai.defineFlow(
  {
    name: 'chatWithAiAssistantFlow',
    inputSchema: ChatWithAiAssistantInputSchema,
    outputSchema: ChatWithAiAssistantOutputSchema,
  },
  async input => {
    const {output} = await chatWithAiAssistantPrompt(input);
    return output!;
  }
);
