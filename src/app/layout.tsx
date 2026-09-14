import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import "@/styles/navbar.css";
import { Toaster } from "sonner";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "Dropterest — Ideas, beautifully organized.",
  description: "Discover, save, organize, and revisit everything that inspires you.",
};

import QueryProvider from "@/components/providers/QueryProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${newsreader.variable}`}>
      <body className="font-sans antialiased bg-[#FAF8F5] text-[#18181B] selection:bg-[#4EEDA4] selection:text-[#0A261A]">
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
