import { BuilderHeader } from "@/components/builder/builder-header";
import { DocumentSettings } from "@/components/builder/document-settings";
import { ResumeFormContainer } from "@/components/builder/resume-form-container";
import { ResumePreviewContainer } from "@/components/builder/resume-preview-container";
import { ResumeAllPages } from "@/components/builder/resume-preview";

export default function BuilderPage() {
  return (
    <>
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-slate-50 dark:bg-[#0B0F19]">
      <BuilderHeader />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-8 sm:py-10 xl:border-r xl:border-slate-200 xl:dark:border-slate-800 xl:bg-white xl:dark:bg-[#0B0F19]">
          <div className="mx-auto max-w-3xl">
            <DocumentSettings />
            <div>
              <ResumeFormContainer />
            </div>
          </div>
        </div>

        {/* Right Preview Pane */}
        <div className="hidden w-full max-w-[50%] overflow-y-auto bg-slate-100/50 px-5 py-7 dark:bg-[#070A10] sm:px-8 sm:py-10 xl:block xl:max-w-[55%] 2xl:max-w-[60%]">
          <div className="mx-auto max-w-4xl">
            <ResumePreviewContainer />
          </div>
        </div>
      </div>
    </main>
    <ResumeAllPages />
    </>
  );
}