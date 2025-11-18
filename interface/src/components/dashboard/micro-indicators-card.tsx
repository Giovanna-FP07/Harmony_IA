import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, UserRound, Clock } from "lucide-react";

export function MicroIndicatorsCard() {
  return (
    <Card className="xl:col-span-1">
      <CardHeader>
        <CardTitle>Micro Indicadores</CardTitle>
        <CardDescription>Sinais sutis de seu estado atual.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smile className="h-6 w-6 text-muted-foreground" />
            <span className="font-medium">Tensão Facial</span>
          </div>
          <Badge variant="outline">Baixa</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserRound className="h-6 w-6 text-muted-foreground" />
            <span className="font-medium">Inquietação Corporal</span>
          </div>
          <Badge variant="default">Normal</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-muted-foreground" />
            <span className="font-medium">Tempo de Foco</span>
          </div>
          <span className="font-semibold">45 min</span>
        </div>
      </CardContent>
    </Card>
  );
}
