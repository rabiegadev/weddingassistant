import type { Metadata } from "next";
import { Cormorant_Garamond, Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

/** Nagłówki marketingu — lekki, „weselny” charakter */
const cormorantDisplay = Cormorant_Garamond({
  variable: "--font-wa-display",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-wa-serif",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-wa-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Weddingassistant.pl",
    template: "%s | Weddingassistant.pl",
  },
  description:
    "Jedno miejsce na plan wesela, gości, RSVP, harmonogram, budżet i wspomnienia — w rozwijanej, spójnej marce od Weddingassistant i Weddinfo.",
  metadataBase: new URL("https://weddingassistant.pl"),
  openGraph: { siteName: "Weddingassistant.pl" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pl"
      className={`h-full ${cormorantDisplay.variable} ${playfair.variable} ${dmSans.variable} antialiased`}
    >
      <body className="flex h-full min-h-svh flex-col bg-[#FDF8F0] font-sans text-[#2B2B2B]">
        {children}
      </body>
    </html>
  );
}
