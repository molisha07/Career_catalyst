import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Catalyst | AI-Powered Career Platform",
  description: "Discover internships, placements, analyze resumes with ATS scores, identify skill gaps, and practice mock interviews with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[#060813]">
        {children}
      </body>
    </html>
  );
}
