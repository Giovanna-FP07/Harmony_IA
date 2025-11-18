'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ChatInput } from './chat-input';
import { ChatMessages, type Message } from './chat-messages';
import { chatWithAiAssistant } from '@/ai/flows/chat-with-ai-assistant';
import { Avatar } from '@/components/ui/avatar';
import { Logo } from '../icons/logo';

const initialMessage: Message = {
  id: '1',
  role: 'assistant',
  content: "Olá! Sou a Aura, sua assistente pessoal de bem-estar. Para começarmos, como posso te chamar?",
};


export function ChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-chat-drawer', handleToggle);

    // Load initial state from localStorage
    const storedName = localStorage.getItem('harmony-ia-userName');
    if (storedName) {
      setUserName(storedName);
    }
    const storedMessages = localStorage.getItem('harmony-ia-messages');
    if(storedMessages) {
        setMessages(JSON.parse(storedMessages));
    } else {
        setMessages([initialMessage]);
    }

    return () => window.removeEventListener('toggle-chat-drawer', handleToggle);
  }, []);

  // Save messages and username to localStorage whenever they change
  useEffect(() => {
    if (messages && messages.length > 0) {
      localStorage.setItem('harmony-ia-messages', JSON.stringify(messages));
    }
    if (userName) {
      localStorage.setItem('harmony-ia-userName', userName);
    }
  }, [messages, userName]);


  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: message,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
       if (!userName) {
        setUserName(message);
        const assistantMessage: Message = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: `É um prazer te conhecer, ${message}! Como posso te ajudar a encontrar seu equilíbrio hoje?`,
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const response = await chatWithAiAssistant({ message, context: `O nome do usuário é ${userName}.` });
        const assistantMessage: Message = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: response.response,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: "Desculpe, estou com problemas para me conectar. Por favor, tente novamente mais tarde.",
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary">
                    <div className="bg-primary/10 flex items-center justify-center h-full w-full">
                        <Logo className="h-6 w-6 text-primary" />
                    </div>
                </Avatar>
                <div>
                    <SheetTitle className="text-xl">Conversar com a Aura</SheetTitle>
                    <SheetDescription>Assistente de Bem-Estar com IA</SheetDescription>
                </div>
            </div>
        </SheetHeader>
        <ChatMessages messages={messages} isLoading={isLoading} />
        <div className="p-4 bg-background/80 border-t">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
