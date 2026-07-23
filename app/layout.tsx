import type { Metadata } from "next";
import { Lato, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "FirstRound — Merchant Payment Network",
  description:
    "Instant settlement for merchants. FirstRound is a non-custodial payment network — funds settle in seconds, fees drop dramatically, and you own your money outright.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
