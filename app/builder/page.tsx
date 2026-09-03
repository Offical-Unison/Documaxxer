import { BuilderHeader } from "@/components/builder/builder-header";
import { DocumentFormContainer } from "@/components/builder/document-form-container";
import { DocumentPreviewContainer } from "@/components/builder/document-preview-container";

export default function BuilderPage() {
  return (
    <>
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-slate-50 dark:bg-[#0B0F19] print:hidden">
      <BuilderHeader />
      <div className="flex flex-1 justify-center overflow-hidden">
        <div className="flex w-full max-w-[1400px] flex-1 overflow-hidden xl:border-x xl:border-slate-200 xl:bg-white xl:dark:border-slate-800 xl:dark:bg-[#0B0F19]">
          <div className="relative flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-8 sm:py-10">
              <div className="mx-auto w-full max-w-3xl">
                <div>
                  <DocumentFormContainer />
                </div>
              </div>
            </div>
          </div>

          {/* Right Preview Pane */}
          <div className="hidden w-[450px] shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50/50 px-6 py-6 dark:border-slate-800 dark:bg-[#070A10]/50 xl:block 2xl:w-[500px]">
            <DocumentPreviewContainer />
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
