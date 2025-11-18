'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ConversationHistoryCard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedMessages = localStorage.getItem('harmony-ia-messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('harmony-ia-messages');
    localStorage.removeItem('harmony-ia-userName');
    setMessages([]);
    toast({
      title: "Histórico Limpo",
      description: "Sua conversa com a Aura foi apagada.",
    });
    // Optional: reload to reset chat state completely
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Conversas</CardTitle>
        <CardDescription>Suas últimas interações com a Aura.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full rounded-md border p-4">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="text-sm">
                  <span className={cn("font-semibold", message.role === 'user' ? 'text-primary' : 'text-accent-foreground')}>{message.role === 'user' ? 'Você' : 'Aura'}:</span>
                  <p className="text-muted-foreground whitespace-pre-wrap">{message.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma conversa encontrada.</p>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" size="sm" onClick={handleClearHistory} disabled={messages.length === 0}>Limpar Histórico</Button>
      </CardFooter>
    </Card>
  );
}
