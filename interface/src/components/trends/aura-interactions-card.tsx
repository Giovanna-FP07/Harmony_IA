'use client';

import { PieChart } from "lucide-react";
import { Pie, PieChart as RechartsPieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { interaction: "Aceitas", value: 27, fill: "hsl(var(--primary))" },
  { interaction: "Recusadas", value: 8, fill: "hsl(var(--accent))" },
];

const chartConfig = {
  value: {
    label: "Interações",
  },
  Aceitas: {
    label: "Aceitas",
    color: "hsl(var(--primary))",
  },
  Recusadas: {
    label: "Recusadas",
    color: "hsl(var(--accent))",
  },
};

export function AuraInteractionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><PieChart className="h-6 w-6" /> Interações com a Aura</CardTitle>
        <CardDescription>Resumo de aceites vs. recusas de pausa sugeridas pela Aura.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <RechartsPieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="interaction"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ChartContainer>
         <div className="flex justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{backgroundColor: 'hsl(var(--primary))'}} />
                <span>Pausas Aceitas (27)</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{backgroundColor: 'hsl(var(--accent))'}} />
                <span>Pausas Recusadas (8)</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
