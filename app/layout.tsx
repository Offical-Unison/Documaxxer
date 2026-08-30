import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import { DocumentProvider } from "@/context/document-context";
import { ThemeProvider } from "@/context/theme-context";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Documaxxer | Modern Resume & CV Builder",
  description: "Build a polished document or CV with confidence.",
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
          <DocumentProvider>{children}</DocumentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}