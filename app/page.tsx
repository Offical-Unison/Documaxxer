import { BuilderHeader } from "@/components/builder/builder-header";
import { ProgressBar } from "@/components/builder/progress-bar";
import { ResumeFormContainer } from "@/components/builder/resume-form-container";
import { ResumePreviewContainer } from "@/components/builder/resume-preview-container";

export default function BuilderPage() {
  return (
    <main className="min-h-screen">
      <BuilderHeader />
      <div className="section-shell py-7 sm:py-10">
        <ProgressBar totalSteps={6} /> 
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0">
            <ResumeFormContainer />
          </div>
          <ResumePreviewContainer />
        </div>
      </div>
    </main>
  );
}