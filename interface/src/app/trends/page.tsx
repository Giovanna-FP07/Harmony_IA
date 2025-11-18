import { Header } from "@/components/layout/header";
import { FatigueScoreCard } from "@/components/dashboard/fatigue-score-card";
import { FatigueEvolutionCard } from "@/components/trends/fatigue-evolution-card";
import { BehavioralPatternCard } from "@/components/trends/behavioral-pattern-card";
import { AuraInteractionsCard } from "@/components/trends/aura-interactions-card";

export default function TrendsPage() {
    return (
        <div className="flex flex-col h-full">
            <Header title="Tendências e Histórico" />
            <main className="flex-1 p-4 md:p-6 overflow-auto">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <FatigueScoreCard />
                    <FatigueEvolutionCard />
                    <BehavioralPatternCard />
                    <AuraInteractionsCard />
                </div>
            </main>
        </div>
    );
}
