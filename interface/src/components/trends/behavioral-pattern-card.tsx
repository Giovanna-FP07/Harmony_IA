'use client';

import { BarChart, PauseCircle, TrendingUp } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  {
    name: "SEG",
    pausas: 4,
    picos: 2,
  },
  {
    name: "TER",
    pausas: 3,
    picos: 5,
  },
  {
    name: "QUA",
    pausas: 6,
    picos: 3,
  },
  {
    name: "QUI",
    pausas: 2,
    picos: 6,
  },
  {
    name: "SEX",
    pausas: 1,
    picos: 8,
  },
   {
    name: "SAB",
    pausas: 5,
    picos: 1,
  },
   {
    name: "DOM",
    pausas: 7,
    picos: 0,
  },
];

export function BehavioralPatternCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BarChart className="h-6 w-6"/> Padrão Comportamental</CardTitle>
        <CardDescription>Frequência de pausas e picos de risco na última semana.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <RechartsBarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey="pausas" name="Pausas" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="picos" name="Picos de Risco" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{backgroundColor: 'hsl(var(--accent))'}} />
                <span>Pausas</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{backgroundColor: 'hsl(var(--primary))'}} />
                <span>Picos de Risco</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
