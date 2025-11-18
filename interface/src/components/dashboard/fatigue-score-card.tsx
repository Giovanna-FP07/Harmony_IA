'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, HeartPulse, Bed, Brain, Dumbbell } from 'lucide-react';
import { calculateFatigueScore, type CalculateFatigueScoreOutput } from '@/ai/flows/calculate-fatigue-score';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from '../ui/scroll-area';


const formSchema = z.object({
    heartRateVariability: z.coerce.number().min(10, 'Deve ser > 10').max(200, 'Deve ser < 200'),
    sleepDuration: z.coerce.number().min(0, 'Deve ser positivo').max(24, 'Deve ser < 24'),
    stressLevel: z.coerce.number().min(1, 'Valor de 1-10').max(10, 'Valor de 1-10'),
    activityLevel: z.coerce.number().min(1, 'Valor de 1-10').max(10, 'Valor de 1-10'),
});

const FormInput = ({ name, label, icon, control, step }: { name: keyof z.infer<typeof formSchema>, label: string, icon: React.ReactNode, control: any, step: number }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm text-muted-foreground font-normal">{icon}{label}</FormLabel>
                <FormControl>
                    <Input type="number" step={step} {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export function FatigueScoreCard() {
    const [result, setResult] = useState<CalculateFatigueScoreOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            heartRateVariability: 60,
            sleepDuration: 7.5,
            stressLevel: 5,
            activityLevel: 5,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setResult(null);
        try {
            const scoreResult = await calculateFatigueScore(values);
            setResult(scoreResult);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Erro ao Calcular a Pontuação',
                description: 'Houve um problema de comunicação com a IA. Por favor, tente novamente.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><HeartPulse className="h-6 w-6" /> Pontuação de Fadiga</CardTitle>
                <CardDescription>Insira suas métricas biométricas recentes para calcular seu nível de fadiga.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
                    <CardContent className="grid grid-cols-2 gap-4">
                        <FormInput name="heartRateVariability" label="VFC (ms)" icon={<HeartPulse size={24} />} control={form.control} step={1} />
                        <FormInput name="sleepDuration" label="Sono (horas)" icon={<Bed size={24} />} control={form.control} step={0.1} />
                        <FormInput name="stressLevel" label="Estresse (1-10)" icon={<Brain size={24} />} control={form.control} step={1} />
                        <FormInput name="activityLevel" label="Atividade (1-10)" icon={<Dumbbell size={24} />} control={form.control} step={1} />
                    </CardContent>
                    <div className="flex-grow" />
                    <CardFooter>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Calcular Pontuação'}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
        
        {result && (
            <AlertDialog open={!!result} onOpenChange={() => setResult(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl text-center">Seus Resultados de Fadiga</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            Com base nas suas métricas, aqui está sua pontuação e recomendações.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="space-y-4 my-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-muted-foreground">Pontuação de Fadiga</span>
                            <span className="font-bold text-2xl text-primary">{result.fatigueScore} / 100</span>
                        </div>
                        <Progress value={result.fatigueScore} className="h-3" />
                        <div>
                            <h4 className="font-medium mt-4 mb-2">Recomendações da Aura</h4>
                            <ScrollArea className="h-32 rounded-md border p-3">
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.recommendations}</p>
                            </ScrollArea>
                        </div>
                    </div>

                    <AlertDialogFooter className="mt-4">
                        <AlertDialogAction onClick={() => setResult(null)}>
                            Fechar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
        </>
    );
}
