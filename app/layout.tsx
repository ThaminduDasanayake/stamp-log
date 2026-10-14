import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "StampLog — AI-Powered Release Notes Engine",
  description:
    "Automated multi-audience changelog synthesis engine built for modern developer teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        GeistSans.variable,
        GeistMono.variable,
        GeistPixelSquare.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
        {children}
      </body>
    </html>
  );
}

