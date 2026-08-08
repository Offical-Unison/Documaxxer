import { BuilderHeader } from "@/components/builder/builder-header";
import { ProgressBar } from "@/components/builder/progress-bar";
import { ResumeFormContainer } from "@/components/builder/resume-form-container";

export default function BuilderPage() {
  return (
    <main className="min-h-screen">
      <BuilderHeader />
      <div className="section-shell py-7 sm:py-10">
        <ProgressBar totalSteps={5} />
        <div className="mx-auto mt-6 max-w-4xl">
          <ResumeFormContainer />
        </div>
      </div>
    </main>
  );
}
