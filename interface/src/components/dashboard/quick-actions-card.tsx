import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Move, Music, Wind } from "lucide-react";
import Link from "next/link";


export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button variant="outline" className="justify-start w-full" asChild>
            <Link href="https://youtu.be/Ghbhtri8em4?si=loRWf3gc85NGubSe" target="_blank" rel="noopener noreferrer">
                <Wind className="mr-2 h-6 w-6" /> Respiração Guiada
            </Link>
        </Button>
        <Button variant="outline" className="justify-start w-full" asChild>
            <Link href="https://youtu.be/4uFiY9VVHG0?si=js2ZJhW7as7BY1hX" target="_blank" rel="noopener noreferrer">
                <Move className="mr-2 h-6 w-6" /> Exercícios de Alongamento
            </Link>
        </Button>
        <Button variant="outline" className="justify-start w-full" asChild>
            <Link href="https://youtu.be/MYPVQccHhAQ?si=YSjumrdf-kVLtXNy" target="_blank" rel="noopener noreferrer">
                <Music className="mr-2 h-6 w-6" /> Música Relaxante
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
