import { Card } from "@/components/ui/card";
import { PlaceholderContent } from "@/components/builder/placeholder-content";
export function ResumePreviewContainer() { return <Card aria-labelledby="preview-title" className="xl:sticky xl:top-6 xl:self-start"><p className="eyebrow">Preview</p><h2 id="preview-title" className="mt-2 text-xl font-semibold">Your resume</h2><div className="mt-5"><PlaceholderContent title="Live preview" description="Your formatted resume will be shown here once live rendering is added in a later milestone." /></div></Card>; }
