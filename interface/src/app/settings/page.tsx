'use client'

import { useState } from 'react';
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ConversationHistoryCard } from '@/components/settings/conversation-history-card';
import { SupportGuideCard } from '@/components/settings/support-guide-card';


export default function SettingsPage() {
    const [sensitivity, setSensitivity] = useState(70);
    const [threshold, setThreshold] = useState(80);
    const [notifications, setNotifications] = useState(true);
    const { toast } = useToast();

    const handleSaveChanges = () => {
        // In a real app, you would save these settings to a backend.
        console.log({ sensitivity, threshold, notifications });
        toast({
            title: "Configurações Salvas",
            description: "Suas preferências foram atualizadas.",
        });
    };

    return (
        <div className="flex flex-col h-full">
            <Header title="Configurações" />
            <main className="flex-1 p-4 md:p-6 overflow-auto">
                <div className="max-w-2xl mx-auto grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monitoramento por IA</CardTitle>
                            <CardDescription>Ajuste como o Harmony IA monitora seus níveis de fadiga.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="sensitivity" className="font-medium">Sensibilidade de Detecção Facial</Label>
                                    <span className="text-sm font-medium text-primary">{sensitivity}%</span>
                                </div>
                                <Slider
                                    id="sensitivity"
                                    value={[sensitivity]}
                                    onValueChange={(value) => setSensitivity(value[0])}
                                    max={100}
                                    step={1}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Sensibilidade mais alta pode detectar fadiga mais cedo, mas pode ter mais falsos positivos.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="threshold" className="font-medium">Limite de Alerta de Fadiga</Label>
                                    <span className="text-sm font-medium text-primary">{threshold}%</span>
                                </div>
                                <Slider
                                    id="threshold"
                                    value={[threshold]}
                                    onValueChange={(value) => setThreshold(value[0])}
                                    max={100}
                                    step={1}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Defina a pontuação de fadiga na qual você deseja receber um alerta.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notificações</CardTitle>
                            <CardDescription>Gerencie suas preferências de notificação.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                <Label htmlFor="notifications-switch" className="font-medium">Ativar Notificações do App</Label>
                                <Switch
                                    id="notifications-switch"
                                    checked={notifications}
                                    onCheckedChange={setNotifications}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                             <p className="text-xs text-muted-foreground">
                                Gerencie as notificações do WhatsApp no painel de Ações Rápidas em seu painel.
                            </p>
                        </CardFooter>
                    </Card>
                    
                    <ConversationHistoryCard />

                    <SupportGuideCard />

                    <div className="flex justify-end">
                        <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
