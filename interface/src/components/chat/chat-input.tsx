'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

export function ChatInput({
  onSendMessage,
  isLoading,
}: {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Pergunte qualquer coisa para a Aura..."
        disabled={isLoading}
        autoComplete="off"
        className="text-base"
      />
      <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
        <Send className="h-6 w-6" />
        <span className="sr-only">Enviar</span>
      </Button>
    </form>
  );
}
