import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import { ResumeProvider } from "@/context/resume-context";
import { ThemeProvider } from "@/context/theme-context";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Resummaxer | Modern Resume Builder",
  description: "Build a polished resume with confidence.",
  icons: {
    icon: "/icon.svg",
  },
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
      <body className={`${geist.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ResumeProvider>{children}</ResumeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}