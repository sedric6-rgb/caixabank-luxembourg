import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaixaBank Luxembourg — Banque en ligne",
  description:
    "CaixaBank Luxembourg : votre banque en ligne au Luxembourg. Comptes, épargne, crédits, cartes bancaires et services bancaires pour particuliers et professionnels.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-bg text-ink">{children}</body>
    </html>
  );
}
