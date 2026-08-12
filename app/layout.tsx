import type { Metadata } from "next";
import "./globals.css"; // Critical: Imports Tailwind CSS directives

export const metadata: Metadata = {
  title: "Evermind AI Generator",
  description: "Generate structured learning paths powered by FastAPI and Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}