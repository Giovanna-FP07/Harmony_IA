'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Clock } from "lucide-react";
import { Logo } from "../icons/logo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from '../ui/progress';

const PAUSE_DURATION = 180; // 3 minutos

export function AuraSuggestionCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(PAUSE_DURATION);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      // Opcional: Fechar o modal automaticamente ou mostrar mensagem de conclusão.
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setCountdown(PAUSE_DURATION); // Reseta o timer quando abre
    }
  };
  
  const progressPercentage = ((PAUSE_DURATION - countdown) / PAUSE_DURATION) * 100;
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Logo className="h-6 w-6 text-primary" />
              Aura Sugere
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Que tal uma pequena pausa guiada? Alguns minutos podem fazer uma grande diferença no seu dia.
            </p>
          </CardContent>
          <CardFooter>
            <AlertDialogTrigger asChild>
              <Button size="sm" className="w-full">
                <Wind className="mr-2 h-6 w-6" />
                Iniciar Pausa Guiada
              </Button>
            </AlertDialogTrigger>
          </CardFooter>
        </Card>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center">Pausa Guiada para Relaxamento</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">Siga as instruções abaixo para recarregar suas energias.</AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 my-4 text-muted-foreground">
             <div className="space-y-2 text-base">
                <p><strong>1. Respiração Profunda:</strong> Inspire lentamente pelo nariz contando até 4, segure o ar por 4 segundos e expire suavemente pela boca por 6 segundos. Repita.</p>
                <p><strong>2. Relaxamento dos Ombros:</strong> Gire os ombros para cima em direção às orelhas, puxe-os para trás e depois relaxe-os para baixo, liberando a tensão.</p>
                <p><strong>3. Alongamento do Pescoço:</strong> Incline a cabeça suavemente para o lado direito, segure por um instante e repita para o lado esquerdo.</p>
                <p><strong>4. Descanso Visual:</strong> Feche os olhos por um momento ou foque em um objeto distante para relaxar a visão.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 justify-center">
            <Clock className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">{minutes}:{seconds.toString().padStart(2, '0')} restantes</span>
          </div>
          <Progress value={progressPercentage} className="h-2 mt-2" />

          <AlertDialogFooter className="mt-4">
            <AlertDialogAction onClick={() => handleOpenChange(false)}>
              {countdown > 0 ? "Concluir Pausa" : "Finalizar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
