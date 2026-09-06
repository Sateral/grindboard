import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Grindboard | The work leaves a mark",
  description:
    "One unforgiving board for Applications, LeetCode solves, and Counted commits.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-svh bg-background font-sans text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
