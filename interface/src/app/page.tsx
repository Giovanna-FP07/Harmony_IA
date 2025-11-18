import { Header } from "@/components/layout/header";
import { BodyMapCard } from "@/components/dashboard/body-map-card";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { MicroIndicatorsCard } from "@/components/dashboard/micro-indicators-card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Meu Status Atual" />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="space-y-6">
          <WelcomeCard />

          <div className="space-y-6">
            <BodyMapCard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QuickActionsCard />
              <MicroIndicatorsCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
