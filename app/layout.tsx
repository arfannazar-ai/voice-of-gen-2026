import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "The Voice of Gen 2026 | AIESEC × Aleyna",
  description: "AI-powered AIESEC communication engine. Strategic, Disruptive, or Empathetic — your voice, amplified.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`} style={{ background: '#1a1a1f' }}>
        {children}
      </body>
    </html>
  );
}
