import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "BasePort | Airdrop & Wallet Analytics",
  description: "Advanced airdrop portal and wallet analytics for the Base ecosystem.",
  other: {
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: "https://picsum.photos/seed/baseport/800/400",
      button: {
        title: "Launch BasePort",
        action: {
          type: "launch_miniapp",
          name: "BasePort",
          url: process.env.APP_URL || "https://ais-dev-4466id3hqtjutld7mkspcr-615601803900.asia-southeast1.run.app",
          splashImageUrl: "https://picsum.photos/seed/baseport-splash/400/400",
          splashBackgroundColor: "#020617",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body suppressHydrationWarning className="bg-[#020617] text-slate-300 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
