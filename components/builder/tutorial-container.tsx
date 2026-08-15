import { Card } from "@/components/ui/card";
import { PlaceholderContent } from "@/components/builder/placeholder-content";

export function TutorialContainer() {
  return (
    <Card aria-labelledby="tutorial-title">
      <p className="eyebrow">Guidance</p>
      <h1 id="tutorial-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">Build with confidence</h1>
      <div className="mt-4">
        <PlaceholderContent title="Interactive tutorial" description="A guided introduction to the resume-building workflow will appear here in a future milestone." />
      </div>
    </Card>
  );
}