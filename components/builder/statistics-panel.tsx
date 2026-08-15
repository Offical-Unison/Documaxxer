import { Card } from "@/components/ui/card";
import { PlaceholderContent } from "@/components/builder/placeholder-content";

export function StatisticsPanel() {
  return (
    <Card aria-labelledby="statistics-title">
      <h2 id="statistics-title" className="text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50">Resume statistics</h2>
      <div className="mt-4">
        <PlaceholderContent title="Statistics panel" description="Content and completion insights will be available here in a future milestone." />
      </div>
    </Card>
  );
}