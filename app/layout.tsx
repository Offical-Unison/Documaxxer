import type { Metadata } from "next";
import "@/styles/globals.css";
import { ResumeProvider } from "@/context/resume-context";

export const metadata: Metadata = {
  title: "Resumaxxer",
  description: "Build a polished resume with confidence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ResumeProvider>{children}</ResumeProvider>
      </body>
    </html>
  );
}
