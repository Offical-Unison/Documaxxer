import type { Metadata } from "next";
import "@/styles/globals.css";
import { ResumeProvider } from "@/context/resume-context";
import { ThemeProvider } from "@/context/theme-context";

export const metadata: Metadata = {
  title: "Resummaxer",
  description: "Build a polished resume with confidence.",
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <ResumeProvider>{children}</ResumeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}