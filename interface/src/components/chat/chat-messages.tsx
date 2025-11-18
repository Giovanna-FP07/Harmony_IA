'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '../icons/logo';
import { useEffect, useRef } from 'react';
import { ScrollArea } from '../ui/scroll-area';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessages({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if(viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-start gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8 border-2 border-primary/50 shrink-0">
                <div className="bg-primary/10 flex items-center justify-center h-full w-full">
                  <Logo className="h-4 w-4 text-primary" />
                </div>
              </Avatar>
            )}
            <div
              className={cn(
                'p-3 rounded-lg max-w-sm lg:max-w-md shadow-sm',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-card-foreground rounded-bl-none'
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
            <Avatar className="h-8 w-8 border-2 border-primary/50">
              <div className="bg-primary/10 flex items-center justify-center h-full w-full">
                <Logo className="h-4 w-4 text-primary" />
              </div>
            </Avatar>
            <div className="p-3 rounded-lg bg-muted rounded-bl-none space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
