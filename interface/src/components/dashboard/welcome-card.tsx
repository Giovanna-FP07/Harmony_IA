import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function WelcomeCard() {
    return (
        <Card className="lg:col-span-4 bg-primary/10 border-primary/20">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-primary">Bem-vindo ao Harmony IA</CardTitle>
                <CardDescription className="text-lg">Seu assistente pessoal de bem-estar com IA. Vamos ver como você está se sentindo hoje.</CardDescription>
            </CardHeader>
        </Card>
    );
}
