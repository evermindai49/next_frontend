import React from "react";

export const metadata = {
  title: "Evermind AI Generator",
  description: "Generate structured learning paths powered by FastAPI and Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#f8fafc" }}>
        {children}
      </body>
    </html>
  );
}